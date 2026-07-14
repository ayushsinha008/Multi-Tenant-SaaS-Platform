import { Request, Response, NextFunction } from 'express';
import { Project, ProjectStatus } from '../models/Project';
import { Task, TaskStatus } from '../models/Task';
import { Member } from '../models/Member';
import { ActivityLog } from '../models/ActivityLog';

export const getDashboardAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;

    // Overview Stats
    const totalProjects = await Project.countDocuments({ organizationId });
    const totalTasks = await Task.countDocuments({ organizationId });
    const totalMembers = await Member.countDocuments({ organizationId });
    const completedTasks = await Task.countDocuments({ organizationId, status: TaskStatus.DONE });

    // Project Progress (Bar Chart data)
    const projects = await Project.find({ organizationId }).select('name progress').limit(10);
    
    // Task Status Distribution (Pie Chart data)
    const taskStatusCounts = await Task.aggregate([
      { $match: { organizationId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Activity over last 7 days (Line Chart data)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activityTrend = await ActivityLog.aggregate([
      { $match: { organizationId, createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      overview: {
        totalProjects,
        totalTasks,
        totalMembers,
        completedTasks,
      },
      charts: {
        projectsProgress: projects,
        taskStatus: taskStatusCounts,
        activityTrend,
      }
    });
  } catch (error) {
    next(error);
  }
};
