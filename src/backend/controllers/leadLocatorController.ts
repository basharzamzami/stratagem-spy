
import { Request, Response } from 'express';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileUtils.js';
import type { Lead } from '../types/index.js';

export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<Lead>('leads.json');
    res.json({ success: true, data: leads, meta: { total: leads.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
};

export const searchLeads = async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<Lead>('leads.json');
    const { industry, location, minIntent, keyword, company } = req.query;
    
    let filtered = leads;
    
    if (keyword) {
      const k = String(keyword).toLowerCase();
      filtered = filtered.filter(l => 
        l.keywords.some(kw => kw.toLowerCase().includes(k)) ||
        l.title?.toLowerCase().includes(k) ||
        l.company.toLowerCase().includes(k)
      );
    }
    
    if (location) {
      const loc = String(location).toLowerCase();
      filtered = filtered.filter(l => l.location.toLowerCase().includes(loc));
    }
    
    if (industry) {
      const ind = String(industry).toLowerCase();
      filtered = filtered.filter(l => l.industry.toLowerCase().includes(ind));
    }
    
    if (minIntent) {
      const min = parseInt(String(minIntent));
      filtered = filtered.filter(l => l.intentScore >= min);
    }
    
    if (company) {
      const comp = String(company).toLowerCase();
      filtered = filtered.filter(l => l.company.toLowerCase().includes(comp));
    }
    
    res.json({ success: true, data: filtered, meta: { total: filtered.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to search leads' });
  }
};

export const enrichLead = async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<Lead>('leads.json');
    const id = String(req.params.id);
    const index = leads.findIndex(l => l.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    
    // Mock enrichment data
    const enrichment = {
      linkedin: `https://linkedin.com/in/${leads[index].name.replace(/\s+/g, '').toLowerCase()}`,
      companyWebsite: `https://${leads[index].company.replace(/\s+/g, '').toLowerCase()}.com`,
      confidence: 0.87 + Math.random() * 0.1,
      lastEnriched: new Date().toISOString(),
      additionalEmails: [`${leads[index].name.split(' ')[0].toLowerCase()}@${leads[index].company.replace(/\s+/g, '').toLowerCase()}.com`],
      socialProfiles: ['LinkedIn', 'Twitter'],
      technographics: ['Salesforce', 'HubSpot', 'AWS']
    };
    
    leads[index].enrichment = enrichment;
    await writeJsonFile('leads.json', leads);
    
    res.json({ success: true, data: leads[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to enrich lead' });
  }
};

export const createLead = async (req: Request, res: Response) => {
  try {
    const leads = await readJsonFile<Lead>('leads.json');
    const newLead: Lead = {
      id: `lead_${generateId()}`,
      ...req.body,
      lastActivity: new Date().toISOString().split('T')[0]
    };
    
    leads.push(newLead);
    await writeJsonFile('leads.json', leads);
    
    res.status(201).json({ success: true, data: newLead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
};
