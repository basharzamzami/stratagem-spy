
import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile, generateId, filterByQuery } from '../utils/fileUtils.js';
import type { Task } from '../types/index.js';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await readJsonFile<Task>('tasks.json');
    const { status, assignedTo, priority } = req.query;
    
    const filtered = filterByQuery(tasks, {
      status: status as string,
      assignedTo: assignedTo as string,
      priority: priority as string
    }, ['title', 'notes', 'assignedTo']);
    
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
    const tasks = await readJsonFile<Task>('tasks.json');
    const { context } = req.body || {};
    
    const generateTaskTitle = (context: any) => {
      const competitors = context?.competitors || [];
      const keywords = context?.keywords || ['target keyword'];
      const locations = context?.locations || ['target location'];
      
      const templates = [
        `Deploy offer targeting "${keywords[0]}" stolen by ${competitors[0]?.name || 'competitor'}`,
        `Launch Google Ads campaign in ${locations[0]} targeting "${keywords[1] || keywords[0]}" intent cluster`,
        `Optimize landing page conversion with improved CTA and trust signals`,
        `Counter competitor pricing strategy in ${locations[0]} market`,
        `Implement SEO strategy for "${keywords[0]}" keyword dominance`
      ];
      
      return templates[Math.floor(Math.random() * templates.length)];
    };
    
    const generatedTasks: Task[] = Array.from({ length: 3 }, () => ({
      id: generateId(),
      title: generateTaskTitle(context),
      status: 'To Do' as const,
      assignedTo: ['Sarah Chen', 'Mark Rodriguez', 'Alex Kim', 'Lisa Wang'][Math.floor(Math.random() * 4)],
      priority: Math.ceil(Math.random() * 5) as 1 | 2 | 3 | 4 | 5,
      notes: 'Auto-generated task based on competitive intelligence analysis',
      estimatedImpact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      effortHours: Math.ceil(Math.random() * 10) + 2,
      steps: [
        'Analyze competitive landscape',
        'Define strategy and approach',
        'Execute implementation plan',
        'Monitor and optimize results'
      ],
      linkedEntities: context?.competitors || [],
      createdAt: new Date().toISOString()
    }));
    
    tasks.push(...generatedTasks);
    await writeJsonFile('tasks.json', tasks);
    
    res.status(201).json({ success: true, data: generatedTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate tasks' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const tasks = await readJsonFile<Task>('tasks.json');
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    tasks[index] = { ...tasks[index], ...req.body };
    await writeJsonFile('tasks.json', tasks);
    
    res.json({ success: true, data: tasks[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};
