import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { File } from '../models/File';
import { Member } from '../models/Member';

export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    const searchRegex = new RegExp(q as string, 'i');
    const organizationId = req.organization!._id;

    if (!q || typeof q !== 'string') {
      return res.status(200).json({ results: { projects: [], tasks: [], files: [], members: [] } });
    }


    const [projects, tasks, files, members] = await Promise.all([
      Project.find({ organizationId, $or: [{ name: searchRegex }, { description: searchRegex }] }).limit(5),
      Task.find({ organizationId, $or: [{ title: searchRegex }, { description: searchRegex }] }).limit(5),
      File.find({ organizationId, filename: searchRegex }).limit(5),
      Member.find({ organizationId }).populate({
        path: 'userId',
        match: { $or: [{ name: searchRegex }, { email: searchRegex }] },
        select: 'name email avatar'
      }).limit(10)
    ]);

    // Filter out members where userId didn't match the regex (populate match behavior returns null for unmatched)
    const matchedMembers = members.filter(m => m.userId);

    res.status(200).json({
      results: {
        projects,
        tasks,
        files,
        members: matchedMembers
      }
    });
  } catch (error) {
    next(error);
  }
};
