
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Specter Net API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎯 Available endpoints:`);
  console.log(`   - GET /api/health`);
  console.log(`   - GET /api/ad-signal-hijack`);
  console.log(`   - GET /api/ad-signal-hijack/analytics/summary`);
  console.log(`   - GET /api/lead-locator/search`);
  console.log(`   - GET /api/dominance-map`);
  console.log(`   - GET /api/target-analysis/tasks`);
  console.log(`   - GET /api/change-alerts`);
  console.log(`   - GET /api/campaign-manager`);
  console.log(`   - GET /api/competitive-crm`);
  console.log(`   - And more...`);
});
