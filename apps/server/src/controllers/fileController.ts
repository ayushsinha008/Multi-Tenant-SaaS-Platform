import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { v2 as cloudinary } from 'cloudinary';
import { File } from '../models/File';
import { ActivityLogService } from '../services/ActivityLogService';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const { projectId, taskId } = req.body;
    const organizationId = req.organization!._id;

    if (!file) {
      throw createHttpError(400, 'No file uploaded');
    }

    // Since multer stores it in memory (or disk), we can upload buffer/stream to cloudinary
    // In a real app we'd use multer-storage-cloudinary or upload stream directly.
    // Assuming simple base64 upload for demo
    const b64 = Buffer.from(file.buffer).toString('base64');
    let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
    
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: `saas/${organizationId}`,
    });

    const fileDoc = await File.create({
      organizationId,
      projectId,
      taskId,
      uploaderId: req.user!._id,
      url: cldRes.secure_url,
      publicId: cldRes.public_id,
      filename: file.originalname,
      format: cldRes.format || file.mimetype.split('/')[1],
      size: cldRes.bytes,
    });

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'upload_file',
      entityType: 'File',
      entityId: fileDoc._id,
      details: { filename: file.originalname },
      req,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileDoc,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;

    const file = await File.findOne({ _id: id, organizationId });
    if (!file) {
      throw createHttpError(404, 'File not found');
    }

    await cloudinary.uploader.destroy(file.publicId);
    await File.deleteOne({ _id: file._id });

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'delete_file',
      entityType: 'File',
      entityId: file._id,
      details: { filename: file.filename },
      req,
    });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const { projectId, taskId } = req.query;

    const query: any = { organizationId };
    if (projectId) query.projectId = projectId;
    if (taskId) query.taskId = taskId;

    const files = await File.find(query).populate('uploaderId', 'name avatar');
    res.status(200).json({ files });
  } catch (error) {
    next(error);
  }
};
