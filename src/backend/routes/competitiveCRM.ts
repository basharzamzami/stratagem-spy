
import { Router } from 'express';
import { readJsonFile, writeJsonFile, generateId, filterByQuery } from '../utils/fileUtils.js';
import type { CRMData, ApiResponse } from '../types/index.js';

const router = Router();

// GET /api/competitive-crm - get all CRM data
router.get('/', async (req, res) => {
  try {
    const crmData = await readJsonFile<CRMData>('crm.json');
    const { type, stage } = req.query;
    
    let filtered = crmData;
    
    if (type) {
      filtered = filtered.filter(item => item.type === type);
    }
    
    if (stage && type === 'deal') {
      filtered = filtered.filter(item => item.stage === stage);
    }
    
    res.json({ 
      status: 'success', 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch CRM data' });
  }
});

// GET /api/competitive-crm/analytics - get CRM analytics
router.get('/analytics', async (req, res) => {
  try {
    const crmData = await readJsonFile<CRMData>('crm.json');
    
    const contacts = crmData.filter(item => item.type === 'contact');
    const deals = crmData.filter(item => item.type === 'deal');
    const companies = crmData.filter(item => item.type === 'company');
    
    const analytics = {
      totalContacts: contacts.length,
      totalDeals: deals.length,
      totalCompanies: companies.length,
      totalDealValue: deals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      avgDealSize: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.value || 0), 0) / deals.length : 0,
      dealsByStage: deals.reduce((acc, deal) => {
        const stage = deal.stage || 'unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgProbability: deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.probability || 0), 0) / deals.length : 0
    };
    
    res.json({ status: 'success', data: analytics });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch analytics' });
  }
});

// POST /api/competitive-crm - create new CRM entry
router.post('/', async (req, res) => {
  try {
    const crmData = await readJsonFile<CRMData>('crm.json');
    const newEntry: CRMData = {
      id: `crm_${generateId()}`,
      ...req.body,
      lastContact: new Date().toISOString(),
      notes: req.body.notes || [],
      tags: req.body.tags || []
    };
    
    crmData.push(newEntry);
    await writeJsonFile('crm.json', crmData);
    
    res.status(201).json({ status: 'success', data: newEntry });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create CRM entry' });
  }
});

export default router;
