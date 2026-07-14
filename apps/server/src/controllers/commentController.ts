import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Comment } from '../models/Comment';
import { Task } from '../models/Task';
import { Project } from '../models/Project';

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, entityId, entityType, parentId } = req.body;
    const organizationId = req.organization!._id;
    const authorId = req.user?._id;

    // Validate entity exists
    if (entityType === 'Task') {
      const task = await Task.findOne({ _id: entityId, organizationId });
      if (!task) throw createHttpError(404, 'Task not found');
    } else if (entityType === 'Project') {
      const project = await Project.findOne({ _id: entityId, organizationId });
      if (!project) throw createHttpError(404, 'Project not found');
    } else {
      throw createHttpError(400, 'Invalid entityType');
    }

    const comment = await Comment.create({
      content,
      authorId,
      organizationId,
      entityId,
      entityType,
      parentId: parentId || null
    });

    await comment.populate('authorId', 'name avatar email');

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { entityId, entityType } = req.query;
    const organizationId = req.organization!._id;

    if (!entityId || !entityType) {
      throw createHttpError(400, 'entityId and entityType are required');
    }

    const comments = await Comment.find({ organizationId, entityId, entityType })
      .populate('authorId', 'name avatar email')
      .sort({ createdAt: 1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user?._id;
    const organizationId = req.organization!._id;

    const comment = await Comment.findOneAndUpdate(
      { _id: id, authorId, organizationId },
      { content, isEdited: true },
      { new: true }
    ).populate('authorId', 'name avatar email');

    if (!comment) {
      throw createHttpError(404, 'Comment not found or unauthorized');
    }

    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const authorId = req.user?._id;
    const organizationId = req.organization!._id;

    const comment = await Comment.findOneAndDelete({ _id: id, authorId, organizationId });
    if (!comment) {
      throw createHttpError(404, 'Comment not found or unauthorized');
    }

    // Delete child comments if any
    await Comment.deleteMany({ parentId: id, organizationId });

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
