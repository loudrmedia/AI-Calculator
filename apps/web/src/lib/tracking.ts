'use client';

/**
 * Marketing attribution capture.
 *
 * UTM tags and ad click IDs (gclid/wbraid/gbraid) arrive as URL query params on
 * the landing page. We capture them (plus the landing URL and referrer) on the
 * FIRST page load and persist them in sessionStorage, so they survive refreshes
 * and any in-session navigation and are still available at final submit.
 */

const STORAGE_KEY = 'lead_tracking';

export interface TrackingParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  landingPageUrl?: string;
  referrer?: string;
}

const URL_KEYS: (keyof TrackingParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'wbraid',
  'gbraid',
];

function readFromUrl(): TrackingParams {
  const params = new URLSearchParams(window.location.search);
  const captured: TrackingParams = {};
  URL_KEYS.forEach((key) => {
    const val = params.get(key);
    if (val) captured[key] = val;
  });
  captured.landingPageUrl = window.location.href;
  captured.referrer = document.referrer || undefined;
  return captured;
}

// Store first-touch attribution once per session so we don't overwrite the
// original values if the user later lands on a param-less internal URL.
export function captureTrackingParams(): void {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(readFromUrl()));
  } catch {
    // sessionStorage can be unavailable (private mode / blocked) — ignore
  }
}

export function getTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as TrackingParams;
  } catch {
    // fall through to reading the current URL
  }
  return readFromUrl();
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const CONVERSION_FIRED_KEY = 'lead_conversion_fired';

/**
 * Pushes the `lead_conversion` event into GTM's dataLayer when a visitor
 * completes the funnel and reaches the results screen.
 *
 * Fires at most once per session (guarded via sessionStorage) so a page
 * refresh or back/forward navigation on the results screen can't double-count
 * the conversion. `virtualPagePath` lets GTM/GA treat this as a `/thankyou`
 * pageview even though the browser URL never actually changes.
 */
export function trackLeadConversion(data: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  let alreadyFired = false;
  try {
    alreadyFired = sessionStorage.getItem(CONVERSION_FIRED_KEY) === '1';
  } catch {
    // sessionStorage unavailable — fall through and fire anyway
  }
  if (alreadyFired) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'lead_conversion',
    virtualPagePath: '/thankyou',
    ...data,
  });

  try {
    sessionStorage.setItem(CONVERSION_FIRED_KEY, '1');
  } catch {
    // ignore — worst case the event could fire again on refresh
  }
}
