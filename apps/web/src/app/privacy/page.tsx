import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Case Calculator',
  description: 'Privacy policy for the AI Case Calculator service.',
};

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
          Last Updated: May 12, 2026
        </p>

        <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>1. Introduction</h2>
            <p>
              This Privacy Policy describes how we collect, use, and share information when you use 
              our AI Case Calculator service (&quot;Service&quot;). By using the Service, you agree to the 
              collection and use of information in accordance with this policy.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>2. Information We Collect</h2>
            
            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px' }}>
              2.1 Information You Provide
            </h3>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Contact information (name, email address, phone number)</li>
              <li>Location information (zip code)</li>
              <li>Accident details (type, timing, fault status, injuries)</li>
              <li>Description of your accident (if provided)</li>
            </ul>

            <h3 style={{ fontSize: '16px', marginTop: '16px', marginBottom: '8px' }}>
              2.2 Information Collected Automatically
            </h3>
            <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
              <li>Device and browser information</li>
              <li>IP address</li>
              <li>Usage data and analytics</li>
              <li>Referral source and marketing attribution (UTM parameters)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Provide and operate the case estimation Service</li>
              <li>Connect you with legal resources and representatives</li>
              <li>Contact you regarding your inquiry via phone, email, or text message</li>
              <li>Improve and optimize our Service</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>
                <strong>Legal Service Providers:</strong> Attorneys and law firms who may assist 
                with your claim
              </li>
              <li>
                <strong>Service Providers:</strong> Third parties who help us operate the Service 
                (hosting, analytics, customer relationship management)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              We do not sell your personal information to third parties for their direct marketing purposes.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>5. Communications Consent</h2>
            <p>
              By submitting your contact information, you expressly consent to receive calls and 
              text messages from us and our partners for marketing purposes using automated 
              technology. You may receive messages at any time, including before 8am or after 9pm 
              local time. Consent is not a condition of purchase. Message and data rates may apply.
            </p>
            <p style={{ marginTop: '12px' }}>
              To opt out of text messages, reply STOP to any message. To opt out of calls, inform 
              the representative or contact us at the information below.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or 
              destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes 
              described in this policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>8. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of certain data processing activities</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              To exercise these rights, contact us using the information below.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to collect usage information and 
              improve the Service. You can control cookies through your browser settings.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>10. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for individuals under 18 years of age. We do not 
              knowingly collect personal information from children.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '8px', listStyle: 'none' }}>
              <li>Email: privacy@[your-domain].com</li>
              <li>Phone: (833) 312-4023</li>
            </ul>
          </section>
        </div>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' }}>
          <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
            ← Back to Calculator
          </a>
        </div>
      </div>
    </div>
  );
}
