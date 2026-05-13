'use client';

import { FunnelProvider } from '../lib/funnel-context';
import { Calculator } from '../components/Calculator';

export default function Home() {
  return (
    <FunnelProvider>
      <Calculator />
    </FunnelProvider>
  );
}
