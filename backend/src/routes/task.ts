import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  uploadFile,
} from '../controller/task';

const router = express.Router();

// Get all tasks
router.get('/', authenticate, getTasks);

// Get task by id
router.get('/:id', authenticate, getTaskById);

// Create a new task
router.post('/', authenticate, createTask);

//upload file
router.post('/upload', authenticate, uploadFile);

// Update a task
router.put('/:id', authenticate, updateTask);

// Delete a task
router.delete('/:id', authenticate, deleteTask);

export default router;
