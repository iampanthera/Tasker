import { Request, Response } from 'express';

const cron = require('node-cron');

import Task from '../models/task';
import User from '../models/user';

import upload from '../utils/fileSave';
import { sendReminderEmail } from '../utils/emailSender';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q, statusFilter, priorityFilter, limit, skip } =
      req.query as unknown as {
        q: string;
        statusFilter: string;
        priorityFilter: string;
        limit: string;
        skip: string;
      };

    // Build query object
    let queryObject: any = { user: req.userId };

    if (q) {
      queryObject = {
        $text: { $search: q },
      };
    }

    if (statusFilter) {
      queryObject.status = statusFilter;
    }
    if (priorityFilter && priorityFilter != '0') {
      queryObject.priority = parseInt(priorityFilter);
    }

    const options = {} as unknown as { limit: number; skip: number };
    if (limit) {
      options.limit = parseInt(limit);
    }
    if (skip) {
      options.skip = parseInt(skip);
    }

    const tasks = await Task.find(queryObject)
      .limit(options.limit)
      .skip(options.skip);

    const totalTasksCount = await Task.countDocuments(queryObject);

    res.json({ tasks, totalTasksCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task?.user?.toString() !== req?.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
          const {
        title,
        description,
        dueDate,
        priority,
        status,
        tags,
        reminderFrequency,
        reminderDateTime,
      } = req.body;

      const user = await User.findById(req?.userId);

      const task = new Task({
        title,
        description,
        dueDate,
        priority,
        status,
        tags,
        user: user?._id,
        reminderFrequency,
        reminderDateTime,
      });

      await task.save();
      res.json({ message: 'Task created successfully', task });
      } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, dueDate, priority, tags, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task?.user?.toString() !== req.userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.tags = tags || task.tags;
    task.status = status || task.status;

    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const taskId = req.params.id;
  const userId = req.userId;

  try {
    await Task.findByIdAndDelete(taskId, { where: { user: userId } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const uploadFile = (req: Request, res: Response) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err.message });
    }

    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File details available in req.file object
    console.log('File details:', file);

    res.status(200).json({ message: 'File uploaded successfully' });
  });
};

cron.schedule('* * * * *', async () => {
  try {
    const tasks = await Task.find({
      reminderDateTime: { $lte: new Date() },
    }).populate('user');

    console.log(tasks);

    tasks.forEach(async (task) => {
      if (task.reminderFrequency === 'daily') {
        await sendReminderEmail(task);
      } else if (task.reminderFrequency === 'weekly') {
        // Check if it's the right day to send a weekly reminder
        const taskDayOfWeek = task.reminderDateTime!.getDay();
        const currentDayOfWeek = new Date().getDay();

        // Check if the day of the week matches for the reminder
        if (taskDayOfWeek === currentDayOfWeek) {
          await sendReminderEmail(task);
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tasks for reminders:', error);
  }
});
