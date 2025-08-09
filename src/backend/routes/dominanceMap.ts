
import { Router } from 'express';
import { getDominanceData, getDominanceSummary } from '../controllers/dominanceMapController.js';

const router = Router();

// GET /api/dominance-map - get dominance data with optional filters
router.get('/', getDominanceData);

// GET /api/dominance-map/summary - get aggregated summary by location
router.get('/summary', getDominanceSummary);

export default router;
