import cron from 'node-cron';
import { Project, ProjectStatus } from '../models/Project';
import { Task, TaskStatus } from '../models/Task';

export const initCronJobs = () => {
  // Daily Summary (Runs at 00:00 every day)
  cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running daily summary...');
    try {
      // In a real app, you would fetch tasks due today, active projects, etc.
      // and send an email to organization admins or members
      const activeProjects = await Project.countDocuments({ status: ProjectStatus.ACTIVE });
      console.log(`[CRON] Currently ${activeProjects} active projects.`);
    } catch (error) {
      console.error('[CRON] Error in daily summary:', error);
    }
  });

  // Reminder Notifications (Runs every hour)
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Running reminder notifications...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
      const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

      const tasksDueTomorrow = await Task.find({
        status: { $ne: TaskStatus.DONE },
        dueDate: { $gte: startOfTomorrow, $lte: endOfTomorrow }
      });

      console.log(`[CRON] ${tasksDueTomorrow.length} tasks due tomorrow.`);
      // Would emit socket events or push notifications here
    } catch (error) {
      console.error('[CRON] Error in reminders:', error);
    }
  });

  // Inactive User Reports (Runs once a week on Sunday at 02:00)
  cron.schedule('0 2 * * 0', async () => {
    console.log('[CRON] Running inactive user report...');
    // implementation
  });

  console.log('Cron jobs initialized');
};
