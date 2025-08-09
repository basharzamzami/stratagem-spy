
import { Router } from 'express';
import { getAds, getAdById, createAd, getAdAnalytics } from '../controllers/adSignalHijackController.js';

const router = Router();

// GET /api/ad-signal-hijack - list ads with optional filtering
router.get('/', getAds);

// GET /api/ad-signal-hijack/:id - get specific ad
router.get('/:id', getAdById);

// POST /api/ad-signal-hijack - create new ad tracking
router.post('/', createAd);

// GET /api/ad-signal-hijack/analytics - get ad analytics
router.get('/analytics/summary', getAdAnalytics);

export default router;
