
import { Router } from 'express';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileUtils.js';
import type { Alert, Task, ApiResponse } from '../types/index.js';

const router = Router();

// GET /api/change-alerts - get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await readJsonFile<Alert>('alerts.json');
    const { severity, dismissed, competitor } = req.query;
    
    let filtered = alerts;
    
    if (severity) {
      filtered = filtered.filter(a => a.severity === severity);
    }
    
    if (dismissed !== undefined) {
      const isDismissed = dismissed === 'true';
      filtered = filtered.filter(a => a.dismissed === isDismissed);
    }
    
    if (competitor) {
      filtered = filtered.filter(a => a.competitor.toLowerCase().includes(String(competitor).toLowerCase()));
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    res.json({ 
      status: 'success', 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch alerts' });
  }
});

// POST /api/change-alerts/:id/dismiss - dismiss an alert
router.post('/:id/dismiss', async (req, res) => {
  try {
    const alerts = await readJsonFile<Alert>('alerts.json');
    const id = parseInt(req.params.id);
    const index = alerts.findIndex(a => a.id === id);
    
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: 'Alert not found' });
    }
    
    alerts[index].dismissed = true;
    alerts[index].actionTaken = req.body.actionTaken || 'Alert dismissed by user';
    await writeJsonFile('alerts.json', alerts);
    
    res.json({ status: 'success', data: alerts[index] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to dismiss alert' });
  }
});

// POST /api/change-alerts/:id/create-task - create task from alert
router.post('/:id/create-task', async (req, res) => {
  try {
    const alerts = await readJsonFile<Alert>('alerts.json');
    const tasks = await readJsonFile<Task>('tasks.json');
    const id = parseInt(req.params.id);
    const alert = alerts.find(a => a.id === id);
    
    if (!alert) {
      return res.status(404).json({ status: 'error', message: 'Alert not found' });
    }
    
    const newTask: Task = {
      id: generateId(),
      title: req.body.title || `Respond to: ${alert.summary}`,
      status: 'To Do',
      assignedTo: req.body.assignedTo || 'Unassigned',
      priority: alert.severity === 'critical' ? 1 : alert.severity === 'high' ? 2 : 3,
      notes: `Auto-generated from alert: ${alert.description}`,
      estimatedImpact: alert.severity === 'critical' ? 'high' : 'medium',
      effortHours: req.body.effortHours || 4,
      steps: req.body.steps || [
        'Analyze competitor change impact',
        'Develop counter-strategy',
        'Implement response plan',
        'Monitor results'
      ],
      linkedEntities: [{ type: 'alert', id: alert.id }],
      createdAt: new Date().toISOString(),
      dueDate: req.body.dueDate
    };
    
    tasks.push(newTask);
    await writeJsonFile('tasks.json', tasks);
    
    res.status(201).json({ status: 'success', data: newTask });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create task from alert' });
  }
});

export default router;
