
import { Request, Response } from 'express';
import { readJsonFile, filterByQuery } from '../utils/fileUtils.js';
import type { Lead } from '../types/index.js';

export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<Lead>('leads.json');
    res.json({ 
      success: true, 
      data: leads,
      meta: { total: leads.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

export const searchLeads = async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<Lead>('leads.json');
    const { keyword, location, industry, minIntent } = req.query;
    
    let filtered = leads;
    
    if (keyword) {
      const keywordStr = String(keyword).toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(keywordStr) ||
        lead.company.toLowerCase().includes(keywordStr) ||
        lead.keywords.some(k => k.toLowerCase().includes(keywordStr))
      );
    }
    
    if (location) {
      filtered = filtered.filter(lead => 
        lead.location.toLowerCase().includes(String(location).toLowerCase())
      );
    }
    
    if (industry) {
      filtered = filtered.filter(lead => 
        lead.industry.toLowerCase() === String(industry).toLowerCase()
      );
    }
    
    if (minIntent) {
      const minIntentScore = parseInt(String(minIntent));
      filtered = filtered.filter(lead => lead.intentScore >= minIntentScore);
    }
    
    res.json({ 
      success: true, 
      data: filtered,
      meta: { 
        total: filtered.length,
        filters: { keyword, location, industry, minIntent }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search leads' });
  }
};

export const enrichLead = async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id;
    
    // Mock enrichment data
    const enrichment = {
      socialProfiles: {
        linkedin: `https://linkedin.com/in/${leadId}`,
        twitter: `@${leadId}_company`
      },
      companyDetails: {
        revenue: '$1M-5M',
        employees: '50-200',
        founded: '2018',
        website: `https://${leadId}-company.com`
      },
      technographics: [
        'Salesforce CRM',
        'Google Analytics',
        'HubSpot Marketing'
      ],
      recentActivity: [
        'Visited pricing page 3 times this week',
        'Downloaded competitor comparison guide',
        'Attended webinar on marketing automation'
      ]
    };
    
    res.json({ 
      success: true, 
      message: 'Lead enriched successfully',
      data: { id: leadId, enrichment }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to enrich lead' });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const leadData = req.body;
    
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      lastActivity: new Date().toISOString(),
      keywords: leadData.keywords || [],
      intentScore: leadData.intentScore || 50
    };
    
    res.json({ 
      success: true, 
      message: 'Lead created successfully',
      data: newLead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
};
