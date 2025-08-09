
import { Router } from 'express';
import { readJsonFile, writeJsonFile, generateId, filterByQuery } from '../utils/fileUtils.js';
import type { AdItem, ApiResponse } from '../types/index.js';

const router = Router();

// GET /api/ad-signal-hijack - list ads with optional filtering
router.get('/', async (req, res) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const { platform, competitor, active, creative_type } = req.query;
    
    const filtered = filterByQuery(ads, { 
      platform: platform as string,
      competitor: competitor as string,
      active: active as string,
      creative_type: creative_type as string
    }, ['competitor', 'title', 'description']);

    const response: ApiResponse<AdItem[]> = {
      status: 'success',
      data: filtered,
      meta: { total: filtered.length }
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch ads' });
  }
});

// GET /api/ad-signal-hijack/:id - get specific ad
router.get('/:id', async (req, res) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const id = parseInt(req.params.id);
    const ad = ads.find(a => a.id === id);
    
    if (!ad) {
      return res.status(404).json({ status: 'error', message: 'Ad not found' });
    }
    
    res.json({ status: 'success', data: ad });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch ad' });
  }
});

// POST /api/ad-signal-hijack - create new ad tracking
router.post('/', async (req, res) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const newAd: AdItem = {
      id: generateId(),
      ...req.body,
      date: new Date().toISOString().split('T')[0]
    };
    
    ads.push(newAd);
    await writeJsonFile('ads.json', ads);
    
    res.status(201).json({ status: 'success', data: newAd });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create ad' });
  }
});

// PUT /api/ad-signal-hijack/:id - update ad
router.put('/:id', async (req, res) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const id = parseInt(req.params.id);
    const index = ads.findIndex(a => a.id === id);
    
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: 'Ad not found' });
    }
    
    ads[index] = { ...ads[index], ...req.body };
    await writeJsonFile('ads.json', ads);
    
    res.json({ status: 'success', data: ads[index] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update ad' });
  }
});

// DELETE /api/ad-signal-hijack/:id - delete ad
router.delete('/:id', async (req, res) => {
  try {
    const ads = await readJsonFile<AdItem>('ads.json');
    const id = parseInt(req.params.id);
    const index = ads.findIndex(a => a.id === id);
    
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: 'Ad not found' });
    }
    
    ads.splice(index, 1);
    await writeJsonFile('ads.json', ads);
    
    res.json({ status: 'success', message: 'Ad deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete ad' });
  }
});

// GET /api/ad-signal-hijack/analytics - get ad analytics
router.get('/analytics/summary', async (req, res) => {
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
    
    res.json({ status: 'success', data: analytics });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch analytics' });
  }
});

export default router;
