import '../styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

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
      <body>
        {children}

        {/* Microsoft Clarity - session recording & heatmaps */}
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xg947w7uiw");
            `,
          }}
        />

        {/* Hidden form for TrustedForm to inject certificate URL */}
        <form id="trustedform-container" style={{ display: 'none' }} aria-hidden="true">
          <input type="hidden" name="xxTrustedFormCertUrl" id="xxTrustedFormCertUrl" />
        </form>
        
        {/* TrustedForm - Lead Certification */}
        <Script
          id="trustedform"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var tf = document.createElement('script');
                tf.type = 'text/javascript';
                tf.async = true;
                tf.src = 'https://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&use_tagged_consent=true&l=' + new Date().getTime() + Math.random();
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(tf, s);
              })();
            `,
          }}
        />
        <noscript>
          <img src="https://api.trustedform.com/ns.gif" alt="" />
        </noscript>
      </body>
    </html>
  );
}
