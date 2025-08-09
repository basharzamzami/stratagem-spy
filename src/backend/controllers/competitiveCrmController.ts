
import { Request, Response } from 'express';
import { readJsonFile, filterByQuery } from '../utils/fileUtils.js';
import type { CRMData } from '../types/index.js';

export const getCRMData = async (req: Request, res: Response) => {
  try {
    const crmData = await readJsonFile<CRMData>('crm.json');
    const { type, stage } = req.query;
    
    const filtered = filterByQuery(crmData, {
      type: type as string,
      stage: stage as string
    });
    
    res.json({ 
      success: true, 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch CRM data' });
  }
};

export const getCRMAnalytics = async (req: Request, res: Response) => {
  try {
    const crmData = await readJsonFile<CRMData>('crm.json');
    
    const analytics = {
      totalContacts: crmData.filter(d => d.type === 'contact').length,
      totalDeals: crmData.filter(d => d.type === 'deal').length,
      totalCompanies: crmData.filter(d => d.type === 'company').length,
      totalValue: crmData
        .filter(d => d.value)
        .reduce((sum, d) => sum + (d.value || 0), 0),
      avgDealSize: 0,
      conversionRate: 0,
      stageBreakdown: {}
    };
    
    const deals = crmData.filter(d => d.type === 'deal' && d.value);
    if (deals.length > 0) {
      analytics.avgDealSize = analytics.totalValue / deals.length;
    }
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

export const createCRMEntry = async (req: Request, res: Response) => {
  try {
    const crmData = req.body;
    
    const newEntry = {
      id: Date.now().toString(),
      ...crmData,
      lastContact: new Date().toISOString(),
      notes: crmData.notes || [],
      tags: crmData.tags || []
    };
    
    res.json({ 
      success: true, 
      message: 'CRM entry created successfully',
      data: newEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create CRM entry' });
  }
};
