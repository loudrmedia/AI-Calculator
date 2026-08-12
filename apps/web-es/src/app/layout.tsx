import '../styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Calculadora de Casos con IA Gratis | Calcule el Valor de su Reclamo',
  description: 'Descubra al instante el valor potencial de su reclamo por lesiones personales. Obtenga un estimado gratuito y sin compromiso según los detalles de su accidente.',
  keywords: 'calculadora de accidentes de auto, estimado de lesiones personales, calculadora de valor de reclamo, calculadora de acuerdo por accidente',
  openGraph: {
    title: 'Calculadora de Casos con IA Gratis',
    description: 'Descubra al instante el valor potencial de su reclamo por lesiones personales.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WW26NZJK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}

        {/* Google Tag Manager */}
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WW26NZJK');
            `,
          }}
        />
        {/* End Google Tag Manager */}

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

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '871546716745670');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={'https://www.facebook.com/tr?id=871546716745670&ev=PageView&noscript=1'}
            alt=""
          />
        </noscript>

        {/* CallRail - CA dynamic number insertion / call tracking */}
        <Script
          id="callrail"
          src="https://cdn.callrail.com/companies/895949722/4dd3fb9f002950678b7f/12/swap.js"
          strategy="afterInteractive"
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
