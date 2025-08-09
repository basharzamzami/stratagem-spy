
import { Request, Response } from 'express';
import { readJsonFile, filterByQuery } from '../utils/fileUtils.js';
import type { Campaign } from '../types/index.js';

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await readJsonFile<Campaign>('campaigns.json');
    const { status, channel } = req.query;
    
    const filtered = filterByQuery(campaigns, {
      status: status as string,
      channel: channel as string
    });
    
    res.json({ 
      success: true, 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaigns = await readJsonFile<Campaign>('campaigns.json');
    const campaignId = parseInt(req.params.id);
    
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch campaign' });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const campaignData = req.body;
    
    const newCampaign = {
      id: Date.now(),
      ...campaignData,
      status: 'draft',
      kpis: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        roas: 0
      },
      createdAt: new Date().toISOString()
    };
    
    res.json({ 
      success: true, 
      message: 'Campaign created successfully',
      data: newCampaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create campaign' });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const campaignId = parseInt(req.params.id);
    const updateData = req.body;
    
    res.json({ 
      success: true, 
      message: 'Campaign updated successfully',
      data: { id: campaignId, ...updateData }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update campaign' });
  }
};
