import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Case Calculator | Estimate Your Claim Value',
  description: 'Instantly determine the potential value of your personal injury claim. Get a free, no-obligation estimate based on your accident details.',
  keywords: 'car accident calculator, personal injury estimate, claim value calculator, accident settlement calculator',
  openGraph: {
    title: 'Free AI Case Calculator',
    description: 'Instantly determine the potential value of your personal injury claim.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
