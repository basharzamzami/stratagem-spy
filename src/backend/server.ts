
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all route files
import adSignalHijackRoutes from './routes/adSignalHijack.js';
import leadLocatorRoutes from './routes/leadLocator.js';
import dominanceMapRoutes from './routes/dominanceMap.js';
import targetAnalysisRoutes from './routes/targetAnalysis.js';
import changeAlertsRoutes from './routes/changeAlerts.js';
import campaignManagerRoutes from './routes/campaignManager.js';
import competitiveCRMRoutes from './routes/competitiveCRM.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Specter Net API'
  });
});

// Mount route modules
app.use('/api/ad-signal-hijack', adSignalHijackRoutes);
app.use('/api/lead-locator', leadLocatorRoutes);
app.use('/api/dominance-map', dominanceMapRoutes);
app.use('/api/target-analysis', targetAnalysisRoutes);
app.use('/api/change-alerts', changeAlertsRoutes);
app.use('/api/campaign-manager', campaignManagerRoutes);
app.use('/api/competitive-crm', competitiveCRMRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Specter Net API running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
