
# Specter Net Backend API

This is the Express.js + TypeScript backend for the Specter Insights Dashboard.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The API will be available at: `http://localhost:5000`

## API Endpoints

- **Health Check**: `GET /api/health`
- **Ad Signal Hijack**: `GET /api/ad-signal-hijack`
- **Lead Locator**: `GET /api/lead-locator/search`
- **Dominance Map**: `GET /api/dominance-map`
- **Target Analysis**: `GET /api/target-analysis/tasks`
- **Change Alerts**: `GET /api/change-alerts`
- **Campaign Manager**: `GET /api/campaign-manager`
- **Competitive CRM**: `GET /api/competitive-crm`

## Development

The server uses `tsx` for TypeScript execution and file watching. Any changes to `.ts` files will automatically restart the server.

## Data

Mock data is stored in `/data/*.json` files and persists across server restarts.
