# AI Case Calculator

A deterministic, source-cited personal injury case value estimator with a BetterClaims-style multi-step funnel UI. Outputs "with attorney" vs "without attorney" comparison ranges using publicly available data sources.

## Features

- **Multi-step funnel UI** - Guided flow: accident type → injuries → fault → timing → location → details → contact → results
- **Transparent methodology** - Every number traces to a public source with clickable citations
- **With/Without Attorney comparison** - Clear visualization of potential outcomes
- **Cloudflare deployment** - Static export + Pages Functions for serverless API
- **Zapier → GHL integration** - Automatic lead routing to GoHighLevel CRM
- **TCPA-compliant consent** - Timestamped consent capture

## Project Structure

```
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/            # Next.js app router pages
│   │   │   ├── components/     # React components
│   │   │   ├── lib/            # Calculator logic, types, sources
│   │   │   └── styles/         # Global CSS
│   │   └── package.json
│   └── worker/                 # Cloudflare Worker (standalone API)
│       ├── src/index.ts
│       ├── wrangler.toml
│       └── package.json
├── docs/
│   ├── methodology.md          # Internal methodology spec
│   └── zapier-ghl-integration.md  # Integration guide
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install web app dependencies
cd apps/web
npm install

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local` in `apps/web/`:

```env
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_HOOK_ID/
WEBHOOK_SECRET=your-secret-key
```

### Running Tests

```bash
cd apps/web
npm test
```

## Deployment

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build settings:
   - Build command: `npm run build`
   - Build output: `out`
   - Root directory: `apps/web`
3. Add environment variables in Cloudflare dashboard:
   - `ZAPIER_WEBHOOK_URL`
   - `WEBHOOK_SECRET`

### Cloudflare Worker (Alternative)

If using the standalone worker:

```bash
cd apps/worker
npm install
wrangler secret put ZAPIER_WEBHOOK_URL
wrangler secret put WEBHOOK_SECRET
wrangler deploy
```

## Data Sources

All estimates are based on publicly available data (verified May 2026):

1. **[Insurance Information Institute](https://www.iii.org/fact-statistic/facts-statistics-auto-insurance)** - Paid claim averages
2. **[FMCSA Crash Cost Methodology](https://www.fmcsa.dot.gov/safety/data-and-statistics/federal-motor-carrier-safety-administration-crash-cost-methodology-2025)** - Severity scaling
3. **[Lawyers.com](https://legal-info.lawyers.com/personal-injury/experiences-and-outcomes-in-car-accident-cases/car-accident-how-much-can-i-expect-in-compensation.html)** - Multiplier method (1.5×–5×)
4. **[Nolo](https://www.nolo.com/legal-encyclopedia/statutes-of-limitations-personal-injury-cases-30002.html)** - Statute of limitations
5. **[NHTSA](https://www.nhtsa.gov/press-releases/traffic-crashes-cost-america-billions-2019)** - Economic context

See [docs/methodology.md](docs/methodology.md) for complete methodology documentation.

## Integration

### Zapier + GoHighLevel

See [docs/zapier-ghl-integration.md](docs/zapier-ghl-integration.md) for complete setup instructions including:

- Webhook payload schema
- GHL custom field definitions
- Tag logic and pipeline setup
- Testing checklist

## Calculator Logic

### Model A: Without Attorney

```
estimate = (BODILY_INJURY_AVG × severityWeight × 0.5-1.0) + propertyDamage
         = ($28,278 × weight) × faultModifier × timingModifier
```

### Model B: With Attorney

```
economic = BODILY_INJURY_AVG × severityWeight + propertyDamage
nonEconomic = economic × (1.5 to 5.0)  // multiplier method
gross = (economic + nonEconomic) × modifiers
net = gross × (1 - 0.33)  // illustrative fee
```

All outputs rounded UP to nearest dollar.

## Legal Disclaimers

This calculator provides **illustrative estimates for educational purposes only**:

- NOT legal advice
- Does NOT predict actual outcomes
- Does NOT create attorney-client relationship
- Results vary by jurisdiction and specific facts
- Consult a qualified attorney for your situation

## License

Proprietary - All rights reserved
