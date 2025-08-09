
import { Router } from 'express';
import { getAlerts, dismissAlert, createTaskFromAlert } from '../controllers/changeAlertsController.js';

const router = Router();

// GET /api/change-alerts - list alerts with optional filtering
router.get('/', getAlerts);

// POST /api/change-alerts/:id/dismiss - dismiss alert
router.post('/:id/dismiss', dismissAlert);

// POST /api/change-alerts/:id/create-task - create task from alert
router.post('/:id/create-task', createTaskFromAlert);

export default router;
