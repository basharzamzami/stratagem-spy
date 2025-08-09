
import { Router } from 'express';
import { getTasks, generateTasks, updateTask } from '../controllers/targetAnalysisController.js';

const router = Router();

// GET /api/target-analysis/tasks - get all tasks
router.get('/tasks', getTasks);

// POST /api/target-analysis/generate - generate new tasks based on context
router.post('/generate', generateTasks);

// PUT /api/target-analysis/tasks/:id - update task
router.put('/tasks/:id', updateTask);

export default router;
