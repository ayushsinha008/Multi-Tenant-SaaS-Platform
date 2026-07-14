import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/Notification';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const userId = req.user!._id;

    const notifications = await Notification.find({ organizationId, userId })
      .sort({ createdAt: -1 })
      .limit(50); // Just fetch latest 50 for now

    const unreadCount = await Notification.countDocuments({ organizationId, userId, read: false });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;
    const userId = req.user!._id;

    await Notification.findOneAndUpdate(
      { _id: id, organizationId, userId },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organizationId = req.organization!._id;
    const userId = req.user!._id;

    await Notification.updateMany(
      { organizationId, userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const organizationId = req.organization!._id;
    const userId = req.user!._id;

    await Notification.findOneAndDelete({ _id: id, organizationId, userId });

    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};
