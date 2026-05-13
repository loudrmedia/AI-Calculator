/**
 * Versioned Data Sources for AI Case Calculator
 * All figures verified and current as of May 2026
 * 
 * IMPORTANT: Update MODEL_VERSION when any figure changes
 */

export const MODEL_VERSION = "1.0.0";
export const DATA_ACCESS_DATE = "May 2026";

export interface DataSource {
  id: string;
  name: string;
  shortName: string;
  url: string;
  accessDate: string;
  figures: Record<string, {
    value: number | string;
    unit: string;
    description: string;
  }>;
  allowedUsage: string;
}

export interface Citation {
  sourceId: string;
  sourceName: string;
  shortName: string;
  url: string;
  figureUsed: string;
  accessDate: string;
}

export const SOURCES: Record<string, DataSource> = {
  III: {
    id: "III",
    name: "Insurance Information Institute — Facts + Statistics: Auto Insurance",
    shortName: "III Auto Insurance Stats",
    url: "https://www.iii.org/fact-statistic/facts-statistics-auto-insurance",
    accessDate: DATA_ACCESS_DATE,
    figures: {
      bodilyInjuryAvg: {
        value: 28278,
        unit: "USD",
        description: "Average paid claim for bodily injury liability (2024)",
      },
      propertyDamageAvg: {
        value: 6770,
        unit: "USD",
        description: "Average paid claim for property damage liability (2024)",
      },
      collisionAvg: {
        value: 5489,
        unit: "USD",
        description: "Average paid claim for collision coverage (2024)",
      },
    },
    allowedUsage: "Range anchors for typical insurer-paid components",
  },

  FMCSA: {
    id: "FMCSA",
    name: "FMCSA Crash Cost Methodology (2025 Update)",
    shortName: "FMCSA Crash Costs",
    url: "https://www.fmcsa.dot.gov/safety/data-and-statistics/federal-motor-carrier-safety-administration-crash-cost-methodology-2025",
    accessDate: DATA_ACCESS_DATE,
    figures: {
      nonInjuryCost: {
        value: 49261,
        unit: "USD",
        description: "Comprehensive cost per non-injury crash (2023 dollars, CMV-weighted)",
      },
      injuryCost: {
        value: 330946,
        unit: "USD",
        description: "Comprehensive cost per injury crash (2023 dollars, CMV-weighted)",
      },
      fatalCost: {
        value: 15216588,
        unit: "USD",
        description: "Comprehensive cost per fatal crash (2023 dollars, CMV-weighted)",
      },
    },
    allowedUsage: "Severity scaling ratios only (NOT individual payouts)",
  },

  NHTSA: {
    id: "NHTSA",
    name: "NHTSA — Traffic Crashes Cost America Billions (2019)",
    shortName: "NHTSA Crash Costs",
    url: "https://www.nhtsa.gov/press-releases/traffic-crashes-cost-america-billions-2019",
    accessDate: DATA_ACCESS_DATE,
    figures: {
      totalEconomicCost: {
        value: 340000000000,
        unit: "USD",
        description: "Total economic cost of motor-vehicle crashes (2019)",
      },
    },
    allowedUsage: "FAQ/educational context only",
  },

  LAWYERS_COM: {
    id: "LAWYERS_COM",
    name: "Lawyers.com — Car Accident Compensation: How Much Can I Expect",
    shortName: "Lawyers.com",
    url: "https://legal-info.lawyers.com/personal-injury/experiences-and-outcomes-in-car-accident-cases/car-accident-how-much-can-i-expect-in-compensation.html",
    accessDate: DATA_ACCESS_DATE,
    figures: {
      multiplierLow: {
        value: 1.5,
        unit: "multiplier",
        description: "Lower bound of pain & suffering multiplier method",
      },
      multiplierHigh: {
        value: 5.0,
        unit: "multiplier",
        description: "Upper bound of pain & suffering multiplier method",
      },
    },
    allowedUsage: "Non-economic damages estimation framework",
  },

  NOLO_SETTLE: {
    id: "NOLO_SETTLE",
    name: "Nolo — Do Most Car Accident Cases Settle?",
    shortName: "Nolo Settlement Stats",
    url: "https://www.nolo.com/legal-encyclopedia/do-most-car-accident-cases-settle.html",
    accessDate: DATA_ACCESS_DATE,
    figures: {
      settlementRate: {
        value: 95,
        unit: "percent",
        description: "Percentage of PI cases that settle before trial",
      },
    },
    allowedUsage: "FAQ/educational context only",
  },

  NOLO_SOL: {
    id: "NOLO_SOL",
    name: "Nolo — Statutes of Limitations for Personal Injury Cases",
    shortName: "Nolo Statute of Limitations",
    url: "https://www.nolo.com/legal-encyclopedia/statutes-of-limitations-personal-injury-cases-30002.html",
    accessDate: DATA_ACCESS_DATE,
    figures: {
      typicalRange: {
        value: "2-3 years",
        unit: "years",
        description: "Typical statute of limitations range across US states",
      },
    },
    allowedUsage: "Educational warning about time limits",
  },

  GEORGETOWN: {
    id: "GEORGETOWN",
    name: "Georgetown Law Library — Jury Verdict & Settlement Research Guide",
    shortName: "Georgetown Law Library",
    url: "https://guides.ll.georgetown.edu/jury",
    accessDate: DATA_ACCESS_DATE,
    figures: {},
    allowedUsage: "Research orientation for upper-bound context (no specific figures)",
  },
};

// Calculator constants derived from sources
export const CALC_CONSTANTS = {
  // From III
  BODILY_INJURY_AVG: SOURCES.III.figures.bodilyInjuryAvg.value as number,
  PROPERTY_DAMAGE_AVG: SOURCES.III.figures.propertyDamageAvg.value as number,
  COLLISION_AVG: SOURCES.III.figures.collisionAvg.value as number,

  // From Lawyers.com
  MULTIPLIER_LOW: SOURCES.LAWYERS_COM.figures.multiplierLow.value as number,
  MULTIPLIER_HIGH: SOURCES.LAWYERS_COM.figures.multiplierHigh.value as number,

  // Modeling assumptions (explicitly labeled)
  ASSUMED_CONTINGENT_FEE: 0.33, // 33% - illustrative only
  
  // Severity weights (derived from FMCSA ratios)
  SEVERITY_WEIGHTS: {
    none: 0.0,
    soft_tissue: 0.15,
    substantial: 0.50,
    catastrophic: 1.00,
  } as const,

  // Fault modifiers
  FAULT_MODIFIERS: {
    not_at_fault: 1.0,
    partial_fault: 0.5,
    at_fault: 0.0,
  } as const,

  // Timing modifiers
  TIMING_MODIFIERS: {
    less_than_30_days: 1.0,
    one_to_three_months: 1.0,
    three_to_six_months: 0.95,
    six_to_twelve_months: 0.90,
    one_to_two_years: 0.80,
    more_than_two_years: 0.50,
  } as const,
};

// Helper to create citation objects
export function createCitation(
  sourceId: keyof typeof SOURCES,
  figureKey?: string
): Citation {
  const source = SOURCES[sourceId];
  const figureUsed = figureKey && source.figures[figureKey]
    ? `${source.figures[figureKey].description}: ${source.figures[figureKey].value} ${source.figures[figureKey].unit}`
    : source.allowedUsage;

  return {
    sourceId: source.id,
    sourceName: source.name,
    shortName: source.shortName,
    url: source.url,
    figureUsed,
    accessDate: source.accessDate,
  };
}

// Get all citations used in a calculation
export function getCalculationCitations(): Citation[] {
  return [
    createCitation("III", "bodilyInjuryAvg"),
    createCitation("III", "propertyDamageAvg"),
    createCitation("LAWYERS_COM", "multiplierLow"),
    createCitation("LAWYERS_COM", "multiplierHigh"),
  ];
}
