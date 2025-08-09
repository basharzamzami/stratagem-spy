
import { Request, Response } from 'express';
import { readJsonFile, filterByQuery } from '../utils/fileUtils.js';
import type { Alert } from '../types/index.js';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await readJsonFile<Alert>('alerts.json');
    const { severity, dismissed } = req.query;
    
    const filtered = filterByQuery(alerts, {
      severity: severity as string,
      dismissed: dismissed === 'true' ? true : dismissed === 'false' ? false : undefined
    }, ['summary', 'description', 'competitor', 'type']);
    
    res.json({ 
      success: true, 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
  }
};

export const dismissAlert = async (req: Request, res: Response) => {
  try {
    const alertId = parseInt(req.params.id);
    const { actionTaken } = req.body;
    
    // In a real app, this would update the database
    res.json({ 
      success: true, 
      message: 'Alert dismissed',
      data: { id: alertId, dismissed: true, actionTaken }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to dismiss alert' });
  }
};

export const createTaskFromAlert = async (req: Request, res: Response) => {
  try {
    const alertId = parseInt(req.params.id);
    const taskData = req.body;
    
    const newTask = {
      id: Date.now(),
      alertId,
      ...taskData,
      createdAt: new Date().toISOString()
    };
    
    res.json({ 
      success: true, 
      message: 'Task created from alert',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
};
