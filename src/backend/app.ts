
import express from 'express';
import cors from 'cors';
import adSignalHijackRoutes from './routes/adSignalHijack.js';
import leadLocatorRoutes from './routes/leadLocator.js';
import dominanceMapRoutes from './routes/dominanceMap.js';
import targetAnalysisRoutes from './routes/targetAnalysis.js';
import changeAlertsRoutes from './routes/changeAlerts.js';
import campaignManagerRoutes from './routes/campaignManager.js';
import competitiveCRMRoutes from './routes/competitiveCRM.js';

const app = express();

console.log('🚀 Initializing Specter Net API application...');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://be73f8d5-ef94-4c53-92cf-c284a3b1cc3e.lovableproject.com'],
  credentials: true
}));
app.use(express.json());

console.log('✅ Middleware configured');

// Health check
app.get('/api/health', (req, res) => {
  console.log('📊 Health check endpoint called');
  res.json({ 
    success: true,
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Specter Net API is running'
  });
});

// Routes
console.log('🔗 Setting up routes...');
app.use('/api/ad-signal-hijack', adSignalHijackRoutes);
app.use('/api/lead-locator', leadLocatorRoutes);
app.use('/api/dominance-map', dominanceMapRoutes);
app.use('/api/target-analysis', targetAnalysisRoutes);
app.use('/api/change-alerts', changeAlertsRoutes);
app.use('/api/campaign-manager', campaignManagerRoutes);
app.use('/api/competitive-crm', competitiveCRMRoutes);
console.log('✅ Routes configured');

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Endpoint not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    status: 'error',
    message: 'Endpoint not found'
  });
});

export default app;
