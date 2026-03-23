import { Link } from 'react-router-dom';
import './Legal.css';
import elixLogo from './assets/logore.png';

export default function PrivacyPolicy() {
  return (
    <div className="legal-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="legal-container">
        {/* Header */}
        <div className="legal-header">
          <Link to="/login" className="legal-back">← Back to Sign In</Link>
          <div className="legal-brand">
            <img src={elixLogo} alt="Elix AI" className="legal-logo" />
            <span className="legal-brand-name">Elix AI</span>
          </div>
          <div className="legal-badge">Privacy Policy</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-date">Effective Date: March 23, 2026 &nbsp;·&nbsp; Last Updated: March 23, 2026</p>
        </div>

        {/* Body */}
        <div className="legal-body">

          <div className="legal-intro">
            <p>
              Welcome to <strong>Elix AI</strong>. We respect your privacy and are committed to protecting
              the personal data you share with us. This Privacy Policy explains what information we collect,
              how we use it, and your rights regarding that information.
            </p>
            <p>
              By using Elix AI, you agree to the practices described in this policy. If you do not agree,
              please do not use our platform.
            </p>
          </div>

          <section className="legal-section">
            <h2><span className="legal-num">1.</span> Information We Collect</h2>
            <p>When you use Elix AI, we may collect the following types of information:</p>
            <ul>
              <li><strong>Account Information:</strong> Your name, email address, and profile picture obtained via Google Sign-In (OAuth 2.0).</li>
              <li><strong>Usage Data:</strong> Chat messages you send to Elix AI, daily usage counts, and session activity.</li>
              <li><strong>Technical Data:</strong> Browser type, IP address, device information, and access timestamps for security and improvement purposes.</li>
              <li><strong>Cookies:</strong> Session tokens used to keep you signed in. We do not use tracking or advertising cookies.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">2.</span> How We Use Your Information</h2>
            <p>We use your data solely to operate, maintain, and improve Elix AI:</p>
            <ul>
              <li>To authenticate your identity and maintain your session.</li>
              <li>To provide AI-powered chat responses based on your input.</li>
              <li>To track and display your daily chat usage on your dashboard.</li>
              <li>To detect and prevent abuse, spam, or security threats.</li>
              <li>To improve the performance and features of the platform over time.</li>
            </ul>
            <div className="legal-highlight">
              We do <strong>not</strong> sell, rent, or share your personal data with third parties for advertising or commercial purposes.
            </div>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">3.</span> Google Sign-In & Third-Party Services</h2>
            <p>
              Elix AI uses <strong>Google OAuth 2.0</strong> for authentication and <strong>Supabase</strong> as our
              backend database provider. When you sign in with Google:
            </p>
            <ul>
              <li>We only access your name, email, and profile picture — nothing else from your Google account.</li>
              <li>Your authentication is handled securely by Google and Supabase.</li>
              <li>We store only the minimum data needed to identify your account.</li>
            </ul>
            <p>
              Your use of Google Sign-In is also governed by{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="legal-link">
                Google's Privacy Policy
              </a>.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">4.</span> Data Retention</h2>
            <p>
              We retain your account data for as long as you have an active account on Elix AI. Chat messages
              may be retained temporarily to process responses but are not stored permanently beyond your session
              unless explicitly stated. You may request deletion of your data at any time.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">5.</span> Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your data against unauthorized
              access, disclosure, or loss. This includes:
            </p>
            <ul>
              <li>HTTPS encryption for all data in transit.</li>
              <li>Secure token-based authentication (managed by Supabase).</li>
              <li>No storage of plaintext passwords — authentication is handled entirely by Google OAuth.</li>
            </ul>
            <p>
              No system is 100% secure. If you discover a vulnerability, please contact us immediately.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">6.</span> Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Correct</strong> inaccurate information in your account.</li>
              <li><strong>Delete</strong> your account and associated data.</li>
              <li><strong>Withdraw consent</strong> at any time by discontinuing use of the platform.</li>
            </ul>
            <p>To exercise any of these rights, contact us at the email below.</p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">7.</span> Children's Privacy</h2>
            <p>
              Elix AI is not intended for use by individuals under the age of 13. We do not knowingly collect
              personal data from children. If you believe we have done so, please contact us to have the
              information removed immediately.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">8.</span> Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated"
              date at the top of this page. Continued use of Elix AI after changes constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">9.</span> Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please reach out:</p>
            <div className="legal-contact-card">
              <div className="legal-contact-row">
                <span className="contact-label">Platform</span>
                <span>Elix AI</span>
              </div>
              <div className="legal-contact-row">
                <span className="contact-label">Email</span>
                <a href="mailto:contact@elixai.com" className="legal-link">contact@elixai.com</a>
              </div>
              <div className="legal-contact-row">
                <span className="contact-label">Website</span>
                <Link to="/" className="legal-link">elixai.com</Link>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="legal-footer">
          <p>© 2026 Elix AI · Smart AI Chat Platform</p>
          <div className="legal-footer-links">
            <Link to="/login" className="legal-footer-link">Sign In</Link>
            <Link to="/terms" className="legal-footer-link">Terms of Service</Link>
            <Link to="/" className="legal-footer-link">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
