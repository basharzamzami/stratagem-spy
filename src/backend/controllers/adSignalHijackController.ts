
import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile, generateId, filterByQuery } from '../utils/fileUtils.js';
import type { AdItem } from '../types/index.js';

export const getAds = async (req: Request, res: Response) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const { platform, competitor, active, creative_type } = req.query;
    
    const filtered = filterByQuery(ads, { 
      platform: platform as string,
      competitor: competitor as string,
      active: active as string,
      creative_type: creative_type as string
    }, ['competitor', 'title', 'description']);

    res.json({
      success: true,
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch ads' });
  }
};

export const getAdById = async (req: Request, res: Response) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const id = parseInt(req.params.id);
    const ad = ads.find(a => a.id === id);
    
    if (!ad) {
      return res.status(404).json({ success: false, message: 'Ad not found' });
    }
    
    res.json({ success: true, data: ad });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch ad' });
  }
};

export const createAd = async (req: Request, res: Response) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const newAd: AdItem = {
      id: generateId(),
      ...req.body,
      date: new Date().toISOString().split('T')[0]
    };
    
    ads.push(newAd);
    await writeJsonFile('ads.json', ads);
    
    res.status(201).json({ success: true, data: newAd });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create ad' });
  }
};

export const getAdAnalytics = async (req: Request, res: Response) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const activeAds = ads.filter(ad => ad.active);
    
    const analytics = {
      totalAds: activeAds.length,
      totalSpend: activeAds.reduce((sum, ad) => sum + ad.spend, 0),
      totalImpressions: activeAds.reduce((sum, ad) => sum + ad.impressions, 0),
      totalClicks: activeAds.reduce((sum, ad) => sum + ad.clicks, 0),
      avgCTR: activeAds.reduce((sum, ad) => sum + ad.ctr, 0) / activeAds.length || 0,
      byPlatform: ads.reduce((acc, ad) => {
        acc[ad.platform] = (acc[ad.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};
