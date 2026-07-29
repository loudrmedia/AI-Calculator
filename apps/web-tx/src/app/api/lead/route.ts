import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface LeadPayload {
  inputs: {
    accidentType: string;
    injuries: {
      softTissue: string[];
      substantial: string[];
      catastrophic: string[];
      noInjury: boolean;
    };
    faultStatus: string;
    accidentTiming: string;
    zipCode: string;
    hasPropertyDamage: boolean;
    accidentDescription?: string;
  };
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consentTimestamp: string;
    consentText: string;
  };
  result: {
    withoutAttorney: { low: number; high: number };
    withAttorney: {
      grossLow: number;
      grossHigh: number;
      netLow: number;
      netHigh: number;
    };
    severityCategory: string;
    modelVersion: string;
  };
  utmParams?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
  tracking?: {
    gclid?: string;
    wbraid?: string;
    gbraid?: string;
    landingPageUrl?: string;
    referrer?: string;
  };
  trustedFormCertUrl?: string;
  submittedAt: string;
}

const MAX_STRING_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 2000;

function sanitizeString(str: string | undefined, maxLength: number = MAX_STRING_LENGTH): string {
  if (!str) return '';
  return str.slice(0, maxLength).replace(/[<>]/g, '');
}

// Convert snake_case enum values (e.g. "not_at_fault") into readable,
// space-separated words (e.g. "Not At Fault"). Used as a fallback when a
// value isn't in an explicit label map below.
function humanize(value: string | undefined): string {
  if (!value) return '';
  return value
    .split('_')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

// Explicit maps so the CRM/Zapier payload shows the EXACT option text the user
// saw in the calculator (e.g. "8–30 days ago"), not a re-worded version.
const ACCIDENT_TYPE_LABELS: Record<string, string> = {
  car_accident: 'Car Accident',
  motorcycle_accident: 'Motorcycle Accident',
  truck_accident: 'Truck Accident',
  bicycle_accident: 'Bicycle Accident',
  other: 'Other',
};

const INJURY_LABELS: Record<string, string> = {
  body_aches: 'Body Aches & Pain',
  cuts_scrapes_bruises: 'Cuts, Scrapes & Bruises',
  broken_bones: 'Broken / Fractured Bones',
  internal_bleeding: 'Internal Bleeding',
  scarring: 'Scarring',
  memory_loss: 'Memory Loss',
  surgery_required: 'Surgery Required',
  brain_injury: 'Brain Injury',
  organ_loss: 'Loss of Internal Organs',
  coma: 'Coma',
  paralysis: 'Paralysis',
  amputation: 'Amputation',
  other: 'Other',
};

const FAULT_LABELS: Record<string, string> = {
  not_at_fault: 'No, it was not my fault',
  partial_fault: "I don't know who was at fault",
  at_fault: 'Yes, it was my fault',
};

const TIMING_LABELS: Record<string, string> = {
  within_7_days: 'Within the last 7 days',
  eight_to_30_days: '8–30 days ago',
  one_to_six_months: '1–6 months ago',
  seven_to_twelve_months: '7–12 months ago',
  thirteen_to_eighteen_months: '13-18 months ago',
  more_than_eighteen_months: 'More than 18 months ago',
};

// injury_severity is the overall case-value tier derived from the injuries the
// user picked. Labeled to match the tiers shown on the injuries question.
const SEVERITY_LABELS: Record<string, string> = {
  none: 'No Injury',
  soft_tissue: 'Minor Injuries',
  substantial: 'Serious Injuries',
  catastrophic: 'Severe / Life-Changing',
};

function labelFor(map: Record<string, string>, value: string | undefined): string {
  if (!value) return '';
  return map[value] ?? humanize(value);
}

function validatePayload(payload: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Invalid payload'] };
  }

  const p = payload as LeadPayload;

  if (!p.inputs) errors.push('Missing inputs');
  if (!p.contact) errors.push('Missing contact');
  if (!p.result) errors.push('Missing result');

  if (p.contact) {
    if (!p.contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contact.email)) {
      errors.push('Invalid email');
    }
    if (!p.contact.phone || p.contact.phone.replace(/\D/g, '').length < 10) {
      errors.push('Invalid phone');
    }
    if (!p.contact.firstName) errors.push('Missing first name');
    if (!p.contact.lastName) errors.push('Missing last name');
    if (!p.contact.consentTimestamp) errors.push('Missing consent');
  }

  if (p.inputs) {
    if (!p.inputs.accidentType) errors.push('Missing accident type');
    if (!p.inputs.faultStatus) errors.push('Missing fault status');
    if (!p.inputs.accidentTiming) errors.push('Missing accident timing');
    if (!p.inputs.zipCode || !/^\d{5}$/.test(p.inputs.zipCode)) {
      errors.push('Invalid zip code');
    }
  }

  return { valid: errors.length === 0, errors };
}

function transformForZapier(
  payload: LeadPayload,
  ipAddress: string,
  userAgent: string
): Record<string, unknown> {
  const injuries = payload.inputs.injuries;
  const allInjuries = [
    ...injuries.softTissue,
    ...injuries.substantial,
    ...injuries.catastrophic,
  ];

  return {
    first_name: sanitizeString(payload.contact.firstName),
    last_name: sanitizeString(payload.contact.lastName),
    email: sanitizeString(payload.contact.email),
    phone: sanitizeString(payload.contact.phone),
    
    accident_type: labelFor(ACCIDENT_TYPE_LABELS, payload.inputs.accidentType),
    injuries: allInjuries.map((i) => labelFor(INJURY_LABELS, i)).join(', ') || (injuries.noInjury ? 'No Injury' : ''),
    injury_severity: labelFor(SEVERITY_LABELS, payload.result.severityCategory),
    fault_status: labelFor(FAULT_LABELS, payload.inputs.faultStatus),
    accident_timing: labelFor(TIMING_LABELS, payload.inputs.accidentTiming),
    zip_code: payload.inputs.zipCode,
    has_property_damage: payload.inputs.hasPropertyDamage,
    accident_description: sanitizeString(payload.inputs.accidentDescription, MAX_DESCRIPTION_LENGTH),
    
    estimate_without_attorney_low: payload.result.withoutAttorney.low,
    estimate_without_attorney_high: payload.result.withoutAttorney.high,
    estimate_with_attorney_gross_low: payload.result.withAttorney.grossLow,
    estimate_with_attorney_gross_high: payload.result.withAttorney.grossHigh,
    estimate_with_attorney_net_low: payload.result.withAttorney.netLow,
    estimate_with_attorney_net_high: payload.result.withAttorney.netHigh,
    
    model_version: payload.result.modelVersion,
    consent_timestamp: payload.contact.consentTimestamp,
    consent_text: payload.contact.consentText,
    
    utm_source: payload.utmParams?.utm_source || '',
    utm_medium: payload.utmParams?.utm_medium || '',
    utm_campaign: payload.utmParams?.utm_campaign || '',
    utm_content: payload.utmParams?.utm_content || '',
    utm_term: payload.utmParams?.utm_term || '',

    gclid: sanitizeString(payload.tracking?.gclid),
    wbraid: sanitizeString(payload.tracking?.wbraid),
    gbraid: sanitizeString(payload.tracking?.gbraid),
    landing_page_url: sanitizeString(payload.tracking?.landingPageUrl),
    referrer: sanitizeString(payload.tracking?.referrer),

    ip_address: sanitizeString(ipAddress),
    user_agent: sanitizeString(userAgent),
    
    trusted_form_cert_url: payload.trustedFormCertUrl || '',
    
    submitted_at: payload.submittedAt,
    source: 'ai_case_calculator',
  };
}

function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = request.headers.get('x-forwarded-for') || 'unknown';
    
    const body = await request.json();
    const validation = validatePayload(body);

    if (!validation.valid) {
      return NextResponse.json(
        { ok: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!zapierUrl) {
      console.error('ZAPIER_WEBHOOK_URL not configured');
      return NextResponse.json(
        { ok: true, message: 'Lead received (webhook not configured)' },
        { status: 200 }
      );
    }

    const ipAddress =
      (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '';
    const userAgent = request.headers.get('user-agent') || '';

    const zapierPayload = transformForZapier(body as LeadPayload, ipAddress, userAgent);
    const payloadString = JSON.stringify(zapierPayload);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (webhookSecret) {
      headers['X-Webhook-Signature'] = generateSignature(payloadString, webhookSecret);
    }

    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers,
      body: payloadString,
    });

    if (!response.ok) {
      console.error('Zapier webhook failed:', response.status, await response.text());
      return NextResponse.json(
        { ok: false, error: 'Failed to process lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
