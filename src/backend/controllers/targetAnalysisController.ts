
import { Request, Response } from 'express';
import { readJsonFile, filterByQuery } from '../utils/fileUtils.js';
import type { Task } from '../types/index.js';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await readJsonFile<Task>('tasks.json');
    const { status, assignedTo } = req.query;
    
    const filtered = filterByQuery(tasks, {
      status: status as string,
      assignedTo: assignedTo as string
    }, ['title', 'notes', 'assignedTo', 'status']);
    
    res.json({ 
      success: true, 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tasks' });
  }
};

export const generateTasks = async (req: Request, res: Response) => {
  try {
    const { context } = req.body;
    
    // Mock AI-generated tasks based on context
    const generatedTasks = [
      {
        id: Date.now() + 1,
        title: `Launch targeted campaign for "${context.keyword || 'high-intent keywords'}"`,
        status: 'To Do' as const,
        assignedTo: 'Marketing Team',
        priority: 4 as const,
        notes: `Based on competitor analysis, target ${context.location || 'key markets'} with focused messaging`,
        estimatedImpact: 'high' as const,
        effortHours: 16,
        steps: [
          'Research competitor ad copy',
          'Create landing page',
          'Set up ad campaigns',
          'Monitor and optimize'
        ],
        linkedEntities: [],
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() + 2,
        title: 'Optimize SEO for competitor gap keywords',
        status: 'To Do' as const,
        assignedTo: 'SEO Team',
        priority: 3 as const,
        notes: 'Identified opportunity in competitor keyword gaps',
        estimatedImpact: 'medium' as const,
        effortHours: 12,
        steps: [
          'Audit current rankings',
          'Content gap analysis',
          'Create new content',
          'Build backlinks'
        ],
        linkedEntities: [],
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json({ 
      success: true, 
      message: 'Tasks generated successfully',
      data: generatedTasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate tasks' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.id);
    const updateData = req.body;
    
    res.json({ 
      success: true, 
      message: 'Task updated successfully',
      data: { id: taskId, ...updateData }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};
