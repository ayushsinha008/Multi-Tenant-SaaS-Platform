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

    // Velocity Chart (Last 7 days completed tasks)
    const sevenDaysAgoForVelocity = new Date();
    sevenDaysAgoForVelocity.setDate(sevenDaysAgoForVelocity.getDate() - 7);
    const completedRecentTasks = await Task.find({
      organizationId,
      status: TaskStatus.DONE,
      updatedAt: { $gte: sevenDaysAgoForVelocity }
    });
    
    const velocityChart = new Array(7).fill(0);
    const nowForVelocity = new Date();
    completedRecentTasks.forEach(task => {
      const diffTime = Math.abs(nowForVelocity.getTime() - task.updatedAt.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        velocityChart[6 - diffDays]++;
      }
    });

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
        velocityChart,
      }
    });
  } catch (error) {
    next(error);
  }
};
