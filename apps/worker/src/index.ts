/**
 * AI Case Calculator - Cloudflare Worker
 * 
 * Handles lead submissions and forwards to Zapier webhook
 * with validation, rate limiting, and HMAC signing.
 */

export interface Env {
  ZAPIER_WEBHOOK_URL: string;
  WEBHOOK_SECRET: string;
  ENVIRONMENT: string;
}

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
  trustedFormCertUrl?: string;
  submittedAt: string;
}

const ALLOWED_ORIGINS = [
  'https://autoreliefassistance.com',
  'https://www.autoreliefassistance.com',
  'https://cawa.autoreliefassistance.com',
  'http://localhost:3000',
];

const MAX_STRING_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 2000;

function sanitizeString(str: string | undefined, maxLength: number = MAX_STRING_LENGTH): string {
  if (!str) return '';
  return str.slice(0, maxLength).replace(/[<>]/g, '');
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

function transformForZapier(payload: LeadPayload): Record<string, unknown> {
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
    
    accident_type: payload.inputs.accidentType,
    injuries: allInjuries.join(', ') || (injuries.noInjury ? 'none' : ''),
    injury_severity: payload.result.severityCategory,
    fault_status: payload.inputs.faultStatus,
    accident_timing: payload.inputs.accidentTiming,
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
    
    trusted_form_cert_url: payload.trustedFormCertUrl || '',
    
    submitted_at: payload.submittedAt,
    source: 'ai_case_calculator',
  };
}

async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(payload);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (url.pathname !== '/api/lead' && url.pathname !== '/lead') {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin),
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin),
        },
      });
    }

    try {
      const body = await request.json();
      const validation = validatePayload(body);

      if (!validation.valid) {
        return new Response(
          JSON.stringify({ ok: false, errors: validation.errors }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }

      if (!env.ZAPIER_WEBHOOK_URL) {
        console.error('ZAPIER_WEBHOOK_URL not configured');
        return new Response(
          JSON.stringify({ ok: true, message: 'Lead received (webhook not configured)' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }

      const zapierPayload = transformForZapier(body as LeadPayload);
      const payloadString = JSON.stringify(zapierPayload);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (env.WEBHOOK_SECRET) {
        headers['X-Webhook-Signature'] = await generateSignature(payloadString, env.WEBHOOK_SECRET);
      }

      const response = await fetch(env.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: payloadString,
      });

      if (!response.ok) {
        console.error('Zapier webhook failed:', response.status);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to process lead' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders(origin),
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    } catch (error) {
      console.error('Lead submission error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Internal server error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin),
          },
        }
      );
    }
  },
};
