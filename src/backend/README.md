
# Specter Net Backend API

This is the Express.js + TypeScript backend for the Specter Insights Dashboard.

## Quick Start

1. **Navigate to the backend directory:**
```bash
cd src/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The API will be available at: `http://localhost:5000`

## Important Notes

- **You MUST run these commands from the `src/backend/` directory**
- The server will automatically restart when you make changes to `.ts` files
- If you see "Failed to fetch" errors in the frontend, make sure this backend server is running

## Testing the API

Once the server is running, you can test it:

1. **Health Check**: Visit `http://localhost:5000/api/health` in your browser
2. **Ad Data**: Visit `http://localhost:5000/api/ad-signal-hijack` to see the mock ad data

## API Endpoints

- **Health Check**: `GET /api/health`
- **Ad Signal Hijack**: 
  - `GET /api/ad-signal-hijack` - Get all ads
  - `GET /api/ad-signal-hijack/analytics/summary` - Get analytics
- **Lead Locator**: `GET /api/lead-locator/search`
- **Dominance Map**: `GET /api/dominance-map`
- **Target Analysis**: `GET /api/target-analysis/tasks`
- **Change Alerts**: `GET /api/change-alerts`
- **Campaign Manager**: `GET /api/campaign-manager`
- **Competitive CRM**: `GET /api/competitive-crm`

## Troubleshooting

If you're getting "Failed to fetch" errors:

1. Make sure you're in the `src/backend/` directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the server
4. Check that the server logs show "🚀 Specter Net API server running on http://localhost:5000"
5. Test the health endpoint: `http://localhost:5000/api/health`

## Data

Mock data is stored in `/data/*.json` files and persists across server restarts.
