# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InsightFolio (formerly TradeTide) is a Next.js 15-based stock analytics and portfolio management dashboard that provides real-time market data, AI-powered predictions, portfolio optimization, and technical analysis. The application integrates with Alpha Vantage and Polygon APIs for live market data, and uses a Python FastAPI backend (yfinance) for historical price data used in backtesting.

## Architecture

### Frontend (Next.js 15 + React 19)

- **App Router**: All routes use the Next.js App Router (`app/` directory)
- **Client-Side State**: Portfolio data is stored in localStorage and managed through React state
- **Component Architecture**:
  - `app/page.tsx`: Main dashboard with tabbed interface
  - `components/`: Feature-specific components (portfolio, predictions, analytics, etc.)
  - `components/ui/`: shadcn/ui components (buttons, cards, dialogs, etc.)

### Data Layer

- **Primary Data Service**: `lib/data-service.ts` exports `dataService` (instance of `RealDataService`)
- **API Routes**: `app/api/` contains Next.js API routes that proxy calls to `dataService`
- **Caching Strategy**: `RealDataService` implements in-memory caching with configurable TTLs
- **Type Definitions**: All data structures defined in `lib/types.ts`

### Key Data Flow

1. Client components fetch data via Next.js API routes (`/api/stocks`, `/api/predictions`, etc.)
2. API routes call `dataService` methods
3. `dataService` checks cache, then makes external API calls to Alpha Vantage or Polygon
4. Results are cached and returned through the chain

### External Dependencies

- **Historical Data Server**: Python FastAPI server (`yfinance_api.py`) must be running on port 8000 for backtesting features
- **Market Data APIs**:
  - Alpha Vantage: Primary source for quotes, fundamentals, technical indicators, news
  - Polygon: Fallback for stock quotes
  - API keys are hardcoded in `lib/data-service.ts` (lines 14-15)

### Portfolio Optimization

The `lib/portfolio-optimizer.ts` file contains a sophisticated portfolio optimization engine that implements:
- Minimum Variance Optimization (Conservative)
- Mean-Variance Optimization (Moderate)
- Maximum Sharpe Ratio Optimization (Aggressive)
- Risk metrics calculation (Sharpe ratio, VaR, max drawdown, diversification ratio)
- Rebalancing recommendations with thresholds

## Development Commands

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

Use `--legacy-peer-deps` flag to resolve peer dependency conflicts between React 19 and some UI libraries.

### Start Development Server

```bash
npm run dev
```

App runs on http://localhost:3000

### Start Historical Data Server (Required for Backtesting)

```bash
./start-server.sh
```

Or manually:
```bash
python -m uvicorn yfinance_api:app --host 127.0.0.1 --port 8000
```

Python dependencies required: `fastapi`, `uvicorn`, `yfinance`

### Build for Production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

Note: ESLint and TypeScript errors are ignored during builds (see `next.config.mjs`)

## Key Files and Locations

- **API Keys**: Hardcoded in `lib/data-service.ts` (lines 14-15)
- **Type Definitions**: `lib/types.ts` - all TypeScript interfaces
- **Main Dashboard**: `app/page.tsx` - contains tab navigation and state management
- **Data Service**: `lib/data-service.ts` - singleton instance handling all external API calls
- **Portfolio Optimizer**: `lib/portfolio-optimizer.ts` - optimization algorithms and risk calculations
- **Historical Data API**: `yfinance_api.py` - Python FastAPI endpoint for backtesting

## Important Notes

### Path Alias

The project uses `@/*` path alias pointing to the root directory (configured in `tsconfig.json`):
```typescript
import { dataService } from "@/lib/data-service"
```

### Client vs Server Components

Most components are client components (`"use client"`) due to:
- State management requirements
- Browser API usage (localStorage)
- Interactive features

API routes in `app/api/` are server-side only.

### Build Configuration

The Next.js config (`next.config.mjs`) has:
- ESLint errors ignored during builds
- TypeScript errors ignored during builds
- Image optimization disabled

This is not ideal for production but allows rapid development iteration.

### API Rate Limits

Alpha Vantage free tier has strict rate limits (5 API calls/minute, 500 calls/day). The caching strategy in `RealDataService` helps mitigate this by:
- Caching stock quotes for 60 seconds
- Caching technical indicators for 5 minutes
- Caching market indices for 5 minutes
- Caching fundamental data for 1 hour

### CSV Portfolio Upload

The app supports CSV upload with format:
```csv
symbol,shares,avgCost
AAPL,10,175.50
TSLA,5,700.00
```

See `sample-portfolio.csv` for reference.

## Testing

No test suite is currently implemented in the project.

## Common Development Patterns

### Adding a New Stock Metric

1. Add type definition to `lib/types.ts`
2. Add method to `RealDataService` class in `lib/data-service.ts`
3. Create API route in `app/api/[metric-name]/route.ts`
4. Create or update component in `components/`

### Adding a New Tab to Dashboard

1. Add `<TabsTrigger>` to `app/page.tsx` TabsList
2. Add corresponding `<TabsContent>` with your component
3. Pass necessary state/callbacks to the component

### Working with Real-Time Data

The `subscribeToRealTimeData` method in `dataService` polls every 60 seconds. For true real-time updates, consider WebSocket integration (not currently implemented).
