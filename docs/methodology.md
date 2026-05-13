# AI Case Calculator — Methodology & Limitations Specification

**Version:** 1.0.0  
**Last Updated:** May 12, 2026  
**Classification:** Internal Documentation

---

## Overview

This document defines the methodology, data sources, formulas, and limitations for the AI Case Calculator. All numeric outputs trace directly to publicly available sources or explicitly labeled modeling assumptions.

**Important:** This calculator produces *illustrative ranges*, not predictions of actual case outcomes. Results are for educational purposes only and do not constitute legal advice.

---

## Data Sources Registry

All figures below were verified and accessed as of May 2026.

### Source 1: Insurance Information Institute (III)

- **URL:** https://www.iii.org/fact-statistic/facts-statistics-auto-insurance
- **Access Date:** May 2026
- **Figures Used:**
  - Bodily Injury Liability (avg paid claim): **$28,278**
  - Property Damage Liability (avg paid claim): **$6,770**
  - Collision (avg paid claim): **$5,489**
- **Usage:** Range anchors for "typical insurer-paid components" in Model A (without attorney)
- **Allowed Interpretation:** These represent average paid claims by insurers, not settlements or verdicts

### Source 2: FMCSA Crash Cost Methodology (2025 Update)

- **URL:** https://www.fmcsa.dot.gov/safety/data-and-statistics/federal-motor-carrier-safety-administration-crash-cost-methodology-2025
- **Access Date:** May 2026
- **Figures Used (2023 dollars, CMV-weighted):**
  - Non-injury crash: **$49,261**
  - Injury crash: **$330,946**
  - Fatal crash: **$15,216,588**
- **Usage:** Severity scaling ratios only (injury/non-injury ratio ≈ 6.72x)
- **Allowed Interpretation:** These are comprehensive societal costs, NOT individual payouts. Used only to derive relative severity weights.

### Source 3: NHTSA Traffic Crash Costs (2019 Study)

- **URL:** https://www.nhtsa.gov/press-releases/traffic-crashes-cost-america-billions-2019
- **Access Date:** May 2026
- **Figures Used:**
  - Total economic cost of motor-vehicle crashes: **$340 billion** (2019)
- **Usage:** FAQ/educational context only
- **Allowed Interpretation:** Societal cost context; NOT used in individual calculations

### Source 4: Lawyers.com — Pain & Suffering Multiplier Method

- **URL:** https://legal-info.lawyers.com/personal-injury/experiences-and-outcomes-in-car-accident-cases/car-accident-how-much-can-i-expect-in-compensation.html
- **Access Date:** May 2026
- **Figures Used:**
  - Multiplier range: **1.5× to 5×** economic damages
  - Per diem method: Alternative framework (mentioned but not calculated)
- **Usage:** Non-economic damages estimation in Model B (with attorney)
- **Allowed Interpretation:** Industry-standard estimation frameworks, not guaranteed outcomes

### Source 5: Nolo — Settlement Statistics

- **URL:** https://www.nolo.com/legal-encyclopedia/do-most-car-accident-cases-settle.html
- **Access Date:** May 2026
- **Figures Used:**
  - ~95% of personal injury cases settle before trial
- **Usage:** FAQ/educational context only
- **Allowed Interpretation:** Qualitative context about settlement likelihood

### Source 6: Nolo — Statutes of Limitations

- **URL:** https://www.nolo.com/legal-encyclopedia/statutes-of-limitations-personal-injury-cases-30002.html
- **Access Date:** May 2026
- **Figures Used:**
  - Most states: 2-3 year statute of limitations for PI
- **Usage:** Educational warning about time limits
- **Allowed Interpretation:** General guidance; user must verify their specific state

---

## Injury Severity Taxonomy

### Category Definitions

| Category | UI Options | Severity Weight | Rationale |
|----------|-----------|-----------------|-----------|
| **None** | "I was not injured" | 0.0 | No injury claim |
| **Soft Tissue** | Body aches & pain, Cuts/scrapes/bruises | 0.15 | Minor, typically resolves quickly |
| **Substantial** | Broken bones, Internal bleeding, Scarring, Memory loss | 0.50 | Moderate medical intervention required |
| **Catastrophic** | Surgery required, Brain injury, Organ loss, Coma, Paralysis, Amputation | 1.00 | Severe, life-altering injuries |

### Severity Weight Derivation

Weights are derived from FMCSA tier ratios as *scaling factors*:
- Base ratio: injury ($330,946) / non-injury ($49,261) ≈ 6.72
- Catastrophic assigned weight 1.0 (maximum)
- Substantial assigned weight 0.50 (mid-range)
- Soft Tissue assigned weight 0.15 (lower-complexity)
- None assigned weight 0.0 (no claim)

**Multiple injuries:** When multiple categories selected, use the highest severity weight.

---

## Calculation Models

### Model A: Without Attorney ("Early Settlement Band")

This models a typical early/direct settlement with insurance, anchored to paid-claim averages.

**Formula:**

```
economicBase = III_BODILY_INJURY_AVG × severityWeight
             = $28,278 × severityWeight

propertyComponent = III_PROPERTY_DAMAGE_AVG × (hasPropertyDamage ? 1 : 0)
                  = $6,770 × propertyFlag

Model_A_Low  = round_up(economicBase × 0.5 + propertyComponent)
Model_A_High = round_up(economicBase × 1.0 + propertyComponent)
```

**Assumptions (explicitly disclosed):**
- Represents conservative early settlement without negotiation leverage
- Does not include pain & suffering multiplier
- Based on insurer-paid averages, not maximums

### Model B: With Attorney ("Negotiated Upside Band")

This models potential outcomes with legal representation, applying the multiplier method.

**Formula:**

```
economicBase = III_BODILY_INJURY_AVG × severityWeight
             = $28,278 × severityWeight

propertyComponent = III_PROPERTY_DAMAGE_AVG × (hasPropertyDamage ? 1 : 0)

totalEconomic = economicBase + propertyComponent

// Non-economic (pain & suffering) using multiplier method
nonEconomic_Low  = totalEconomic × MULTIPLIER_LOW   (1.5×)
nonEconomic_High = totalEconomic × MULTIPLIER_HIGH  (5.0×)

Model_B_Gross_Low  = round_up(totalEconomic + nonEconomic_Low)
Model_B_Gross_High = round_up(totalEconomic + nonEconomic_High)

// Net after assumed contingent fee (33% example)
ASSUMED_FEE_RATE = 0.33
Model_B_Net_Low  = round_up(Model_B_Gross_Low × (1 - ASSUMED_FEE_RATE))
Model_B_Net_High = round_up(Model_B_Gross_High × (1 - ASSUMED_FEE_RATE))
```

**Assumptions (explicitly disclosed):**
- Multiplier range (1.5×–5×) from Lawyers.com as industry-standard framework
- 33% contingent fee is illustrative only; actual fees vary by attorney
- Represents potential negotiated/litigated outcomes, not guarantees

---

## Fault Adjustment

| Fault Status | Modifier | Rationale |
|--------------|----------|-----------|
| Not at fault | 1.0 | Full potential recovery |
| Partially at fault | 0.5 | Comparative negligence reduction |
| At fault | 0.0 | Typically no recovery from other party |

**Note:** Comparative/contributory negligence rules vary by state. This is a simplified model.

---

## Timing Adjustment

| Time Since Accident | Modifier | Warning |
|--------------------|----------|---------|
| < 30 days | 1.0 | Optimal timing |
| 1-3 months | 1.0 | Still strong |
| 3-6 months | 0.95 | Act promptly |
| 6-12 months | 0.90 | Urgency increasing |
| 1-2 years | 0.80 | Approaching deadlines |
| > 2 years | 0.50 | May exceed statute of limitations |

**Warning:** Users with >2 years shown prominent statute of limitations warning.

---

## Output Structure

```typescript
interface CalculatorResult {
  // Model A: Without Attorney
  withoutAttorney: {
    low: number;   // rounded up
    high: number;  // rounded up
  };
  
  // Model B: With Attorney
  withAttorney: {
    grossLow: number;   // before fees, rounded up
    grossHigh: number;  // before fees, rounded up
    netLow: number;     // after assumed fee, rounded up
    netHigh: number;    // after assumed fee, rounded up
    assumedFeeRate: number; // 0.33
  };
  
  // Metadata
  modelVersion: string;
  citations: Citation[];
  disclaimers: string[];
}

interface Citation {
  sourceId: string;
  sourceName: string;
  url: string;
  figureUsed: string;
  accessDate: string;
}
```

---

## Rounding Policy

**All monetary outputs are rounded UP to the nearest dollar.**

Rationale: Rounding up provides a slightly optimistic presentation while maintaining defensibility (we never overstate compared to raw calculation by more than $1).

Implementation: `Math.ceil(value)`

---

## Disclaimers (Required Display)

### Primary Disclaimer (Results Page)

> **Important Notice:** This calculator provides illustrative estimates for educational purposes only. It is NOT legal advice and does NOT predict your actual case outcome. Real settlements and verdicts vary significantly based on specific facts, evidence, jurisdiction, insurance coverage, and many other factors. The ranges shown are based on publicly available industry averages and standard estimation frameworks. Consult with a qualified attorney for advice specific to your situation.

### Source Attribution

> Every figure in this estimate is derived from publicly available sources. Click any citation link to verify the underlying data.

### Attorney Fee Disclaimer

> The "after fees" estimate assumes a 33% contingent fee as an illustrative example only. Actual attorney fees vary. This is not a quote or guarantee of any fee arrangement.

### Statute of Limitations Warning (when applicable)

> **Time-Sensitive Notice:** Most states impose a 2-3 year deadline (statute of limitations) to file personal injury claims. Based on your accident date, you should consult an attorney promptly to understand your specific deadline.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 12, 2026 | Initial methodology specification |

---

## Compliance Checklist

- [ ] All numeric claims trace to documented sources
- [ ] Disclaimers displayed prominently on results
- [ ] No guaranteed outcomes implied
- [ ] Attorney fee assumption clearly labeled as illustrative
- [ ] Statute of limitations warning for old accidents
- [ ] TCPA consent obtained before contact information submission
- [ ] Privacy policy and terms accessible
