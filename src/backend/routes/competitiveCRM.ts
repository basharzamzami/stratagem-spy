
import { Router } from 'express';
import { getCRMData, getCRMAnalytics, createCRMEntry } from '../controllers/competitiveCrmController.js';

const router = Router();

// GET /api/competitive-crm - list CRM data with optional filtering
router.get('/', getCRMData);

// GET /api/competitive-crm/analytics - get CRM analytics
router.get('/analytics', getCRMAnalytics);

// POST /api/competitive-crm - create new CRM entry
router.post('/', createCRMEntry);

export default router;
