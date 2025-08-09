
import { Router } from 'express';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileUtils.js';
import type { Campaign, ApiResponse } from '../types/index.js';

const router = Router();

// GET /api/campaign-manager - list all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await readJsonFile<Campaign>('campaigns.json');
    const { status, channel } = req.query;
    
    let filtered = campaigns;
    
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    
    if (channel) {
      filtered = filtered.filter(c => c.channel === channel);
    }
    
    res.json({ 
      status: 'success', 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaign-manager/:id - get specific campaign
router.get('/:id', async (req, res) => {
  try {
    const campaigns = await readJsonFile<Campaign>('campaigns.json');
    const id = parseInt(req.params.id);
    const campaign = campaigns.find(c => c.id === id);
    
    if (!campaign) {
      return res.status(404).json({ status: 'error', message: 'Campaign not found' });
    }
    
    res.json({ status: 'success', data: campaign });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch campaign' });
  }
});

// POST /api/campaign-manager - create new campaign
router.post('/', async (req, res) => {
  try {
    const campaigns = await readJsonFile<Campaign>('campaigns.json');
    const newCampaign: Campaign = {
      id: generateId(),
      name: req.body.name || 'New Campaign',
      channel: req.body.channel || 'google',
      budget: req.body.budget || 1000,
      spent: 0,
      startDate: req.body.startDate || new Date().toISOString(),
      status: 'draft',
      kpis: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        roas: 0
      },
      targeting: {
        locations: req.body.targeting?.locations || [],
        demographics: req.body.targeting?.demographics || [],
        interests: req.body.targeting?.interests || []
      },
      ...req.body
    };
    
    campaigns.push(newCampaign);
    await writeJsonFile('campaigns.json', campaigns);
    
    res.status(201).json({ status: 'success', data: newCampaign });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create campaign' });
  }
});

// PUT /api/campaign-manager/:id - update campaign
router.put('/:id', async (req, res) => {
  try {
    const campaigns = await readJsonFile<Campaign>('campaigns.json');
    const id = parseInt(req.params.id);
    const index = campaigns.findIndex(c => c.id === id);
    
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: 'Campaign not found' });
    }
    
    campaigns[index] = { ...campaigns[index], ...req.body };
    await writeJsonFile('campaigns.json', campaigns);
    
    res.json({ status: 'success', data: campaigns[index] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update campaign' });
  }
});

export default router;
