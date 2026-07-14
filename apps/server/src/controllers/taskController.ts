import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Task, TaskStatus } from '../models/Task';
import { Project } from '../models/Project';
import { ActivityLogService } from '../services/ActivityLogService';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, title, description, priority, labels, dueDate, assignees } = req.body;
    const organizationId = req.organization!._id;

    const project = await Project.findOne({ _id: projectId, organizationId });
    if (!project) {
      throw createHttpError(404, 'Project not found');
    }

    // Get highest position in TODO column to append
    const lastTask = await Task.findOne({ projectId, status: TaskStatus.TODO }).sort('-position');
    const position = lastTask ? lastTask.position + 1024 : 1024;

    const task = await Task.create({
      organizationId,
      projectId,
      title,
      description,
      priority,
      labels,
      dueDate,
      assignees,
      position,
    });

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'create_task',
      entityType: 'Task',
      entityId: task._id,
      details: { title: task.title },
      req,
    });

    // We might want to emit a socket event here if we had access to `io`.
    // Since we don't have it directly in the controller easily without a service wrapper,
    // we can pass it via req.app.get('io') if configured.

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const { projectId, status, priority, search, page = 1, limit = 50 } = req.query;

    const query: any = { organizationId };

    if (projectId) query.projectId = projectId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ position: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('assignees', 'name email avatar')
        .populate('attachments'),
      Task.countDocuments(query),
    ]);

    res.status(200).json({
      tasks,
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

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, organizationId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      throw createHttpError(404, 'Task not found');
    }

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'update_task',
      entityType: 'Task',
      entityId: task._id,
      details: updates,
      req,
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;

    const task = await Task.findOneAndDelete({ _id: id, organizationId });

    if (!task) {
      throw createHttpError(404, 'Task not found');
    }

    await ActivityLogService.log({
      organizationId,
      userId: req.user!._id,
      action: 'delete_task',
      entityType: 'Task',
      entityId: task._id,
      req,
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
