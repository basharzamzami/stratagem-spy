
import { Router } from 'express';
import { getCampaigns, getCampaignById, createCampaign, updateCampaign } from '../controllers/campaignManagerController.js';

const router = Router();

// GET /api/campaign-manager - list campaigns with optional filtering
router.get('/', getCampaigns);

// GET /api/campaign-manager/:id - get specific campaign
router.get('/:id', getCampaignById);

// POST /api/campaign-manager - create new campaign
router.post('/', createCampaign);

// PUT /api/campaign-manager/:id - update campaign
router.put('/:id', updateCampaign);

export default router;
