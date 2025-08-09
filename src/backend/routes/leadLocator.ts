
import { Router } from 'express';
import { getLeads, searchLeads, enrichLead, createLead } from '../controllers/leadLocatorController.js';

const router = Router();

// GET /api/lead-locator - list all leads
router.get('/', getLeads);

// GET /api/lead-locator/search - search leads with filters
router.get('/search', searchLeads);

// POST /api/lead-locator/:id/enrich - enrich lead data
router.post('/:id/enrich', enrichLead);

// POST /api/lead-locator - create new lead
router.post('/', createLead);

export default router;
