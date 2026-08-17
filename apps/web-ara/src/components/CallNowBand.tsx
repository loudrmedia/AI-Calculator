'use client';

import React from 'react';
import { CONFIG } from '../lib/config';

export function CallNowBand() {
  return (
    <section className="ara-call-band">
      <h2>Call Now and Speak Directly with a Case Analyst Today.</h2>
      <a href={CONFIG.PHONE_LINK} className="ara-call-btn">
        {CONFIG.PHONE_NUMBER}
      </a>
    </section>
  );
}
