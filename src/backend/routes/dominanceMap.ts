
import { Router } from 'express';
import { readJsonFile, writeJsonFile, filterByQuery } from '../utils/fileUtils.js';
import type { DominanceData, ApiResponse } from '../types/index.js';

const router = Router();

// GET /api/dominance-map - get dominance data with optional filters
router.get('/', async (req, res) => {
  try {
    const dominanceData = await readJsonFile<DominanceData>('dominanceMap.json');
    const { zip, city, state, device } = req.query;
    
    const filtered = filterByQuery(dominanceData, {
      zip: zip as string,
      city: city as string,
      state: state as string,
      device: device as string
    }, ['city', 'state']);
    
    res.json({ 
      status: 'success', 
      data: filtered,
      meta: { total: filtered.length }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch dominance data' });
  }
});

// GET /api/dominance-map/summary - get aggregated summary by location
router.get('/summary', async (req, res) => {
  try {
    const dominanceData = await readJsonFile<DominanceData>('dominanceMap.json');
    const { city, state } = req.query;
    
    let filtered = dominanceData;
    if (city) filtered = filtered.filter(d => d.city.toLowerCase() === String(city).toLowerCase());
    if (state) filtered = filtered.filter(d => d.state.toLowerCase() === String(state).toLowerCase());
    
    const summary = filtered.reduce((acc, curr) => {
      const key = `${curr.city}, ${curr.state}`;
      if (!acc[key]) {
        acc[key] = {
          location: key,
          zip: curr.zip,
          avgSeoRank: 0,
          avgAdPresence: 0,
          avgMarketShare: 0,
          totalCompetitors: 0,
          deviceBreakdown: {} as Record<string, number>,
          count: 0
        };
      }
      
      acc[key].avgSeoRank += curr.seoRank;
      acc[key].avgAdPresence += curr.adPresence;
      acc[key].avgMarketShare += curr.marketShare;
      acc[key].totalCompetitors += curr.competitorCount;
      acc[key].deviceBreakdown[curr.device] = (acc[key].deviceBreakdown[curr.device] || 0) + 1;
      acc[key].count++;
      
      return acc;
    }, {} as Record<string, any>);
    
    const result = Object.values(summary).map((item: any) => ({
      ...item,
      avgSeoRank: Math.round((item.avgSeoRank / item.count) * 10) / 10,
      avgAdPresence: Math.round(item.avgAdPresence / item.count),
      avgMarketShare: Math.round((item.avgMarketShare / item.count) * 10) / 10,
      avgCompetitors: Math.round(item.totalCompetitors / item.count)
    }));
    
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch summary' });
  }
});

export default router;
