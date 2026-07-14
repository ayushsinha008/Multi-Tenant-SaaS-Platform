import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Project } from '../models/Project';
import { ActivityLogService } from '../services/ActivityLogService';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, tags, status } = req.body;
    const organizationId = req.organization!._id;

    const project = await Project.create({
      organizationId,
      name,
      description,
      tags,
      status,
      members: [req.user!._id], // Creator is a member
    });

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'create_project',
      entityType: 'Project',
      entityId: project._id,
      req,
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const { search, status, sort, page = 1, limit = 10 } = req.query;

    const query: any = { organizationId };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const sortOptions: any = {};
    if (sort === 'name') sortOptions.name = 1;
    else if (sort === 'oldest') sortOptions.createdAt = 1;
    else sortOptions.createdAt = -1; // Newest by default

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate('members', 'name email avatar'),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      projects,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;

    const project = await Project.findOne({ _id: id, organizationId }).populate('members', 'name email avatar');

    if (!project) {
      throw createHttpError(404, 'Project not found');
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;
    const updates = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw createHttpError(404, 'Project not found');
    }

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'update_project',
      entityType: 'Project',
      entityId: project._id,
      req,
    });

    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;

    const project = await Project.findOneAndDelete({ _id: id, organizationId });

    if (!project) {
      throw createHttpError(404, 'Project not found');
    }

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'delete_project',
      entityType: 'Project',
      entityId: project._id,
      req,
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
