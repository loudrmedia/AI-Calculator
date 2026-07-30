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
│   ├── web/                    # Next.js frontend - CA landing page (live)
│   │   ├── src/
│   │   │   ├── app/            # Next.js app router pages
│   │   │   ├── components/     # React components
│   │   │   ├── lib/            # Calculator logic, types, sources
│   │   │   └── styles/         # Global CSS
│   │   └── package.json
│   ├── web-tx/                 # Next.js frontend - TX landing page
│   │                           # (copy of apps/web; has its own Disclaimer/
│   │                           #  config with TX-specific TODOs - see below)
│   ├── web-nationwide/         # Next.js frontend - Nationwide landing page
│   │                           # (copy of apps/web; has its own Disclaimer/
│   │                           #  config with nationwide-specific TODOs)
│   └── worker/                 # Cloudflare Worker (standalone API, shared by all 3 sites)
│       ├── src/index.ts
│       ├── wrangler.toml
│       └── package.json
├── docs/
│   ├── methodology.md          # Internal methodology spec
│   └── zapier-ghl-integration.md  # Integration guide
└── README.md
```

### Multiple state landing pages (CA / TX / Nationwide)

`apps/web`, `apps/web-tx`, and `apps/web-nationwide` are **independent copies** of the
same calculator app. This is intentional: each one can be edited on its own (different
attorney/disclaimer copy, phone number, branding) without affecting the others.

- To change something in the CA version only → edit files under `apps/web`.
- To change something in the TX version only → edit files under `apps/web-tx`.
- To change something in the Nationwide version only → edit files under `apps/web-nationwide`.
- A fix that should apply to all three (e.g. a calculator math bug) currently has to be
  applied to all three folders by hand, since they don't share code.

Each app is a separate Cloudflare Pages project on its own domain, and each posts leads
to its own deployed Cloudflare Worker (so each market can use a different Zapier webhook):

| Market | App folder | Domain | Worker |
|---|---|---|---|
| CA | `apps/web` | `cal.getautoreliefassistance.com` | `ai-calculator-api` |
| TX | `apps/web-tx` | `txcal.myautoreliefassistance.com` | `ai-calculator-tx` |
| Nationwide | `apps/web-nationwide` | `nwcal.myautoreliefassistance.com` | `ai-calculator-nationwide` |

Each app's worker URL is set per Pages project via the `NEXT_PUBLIC_WORKER_URL`
environment variable, and each worker's `ALLOWED_ORIGINS` must contain its own site's
domain or lead submissions are blocked by CORS.

Each worker has its own folder: `apps/worker` (CA), `apps/worker-tx`, and
`apps/worker-nationwide`. Like the web apps, they are independent copies.

`apps/worker-tx` and `apps/worker-nationwide` were reconstructed from the CA worker to
match the already-deployed TX and Nationwide workers, with their `name` and
`ALLOWED_ORIGINS` verified against live CORS behavior. They have not been diffed against
the deployed source, so **confirm against the live worker in the Cloudflare dashboard
before running `wrangler deploy` from either folder**, in case they drifted after
deployment.

**Outstanding for `web-tx` and `web-nationwide`:** both are live but still contain
`TODO(TX)` / `TODO(Nationwide)` placeholders in `src/components/Disclaimer.tsx` and
`src/lib/config.ts` — the attorney sponsor disclosure and the intake phone number are
still CA content and need replacing.

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

There is **one Cloudflare Pages project per landing page**, all pointing at this same
repo but with a different root directory:

| Landing page | Root directory | Domain |
|---|---|---|
| CA | `apps/web` | `cal.getautoreliefassistance.com` |
| TX | `apps/web-tx` | `txcal.myautoreliefassistance.com` |
| Nationwide | `apps/web-nationwide` | `nwcal.myautoreliefassistance.com` |

For each project:

1. Connect this repository to Cloudflare Pages
2. Set build settings:
   - Build command: `npm run build`
   - Build output: `out`
   - Root directory: `apps/web` / `apps/web-tx` / `apps/web-nationwide`
3. Add environment variables in Cloudflare dashboard:
   - `NEXT_PUBLIC_WORKER_URL` — the market's worker endpoint. This is baked in at build
     time; without it the static export falls back to `/api/lead`, which does not exist
     in production and silently breaks lead submission.
4. Attach the project's custom domain, then add that domain to `ALLOWED_ORIGINS` in that
   market's worker and redeploy the worker.

### Cloudflare Workers

Each market has its own worker folder (`apps/worker`, `apps/worker-tx`,
`apps/worker-nationwide`) holding its own secrets, so each can post to a different
Zapier webhook. Deploy from the folder for that market:

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
