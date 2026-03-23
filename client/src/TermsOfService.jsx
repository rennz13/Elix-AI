import { Link } from 'react-router-dom';
import './Legal.css';
import elixLogo from './assets/logore.png';

export default function TermsOfService() {
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
          <div className="legal-badge">Terms of Service</div>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-date">Effective Date: March 23, 2026 &nbsp;·&nbsp; Last Updated: March 23, 2026</p>
        </div>

        {/* Body */}
        <div className="legal-body">

          <div className="legal-intro">
            <p>
              These Terms of Service ("Terms") govern your access to and use of <strong>Elix AI</strong>,
              an AI-powered chat platform. By creating an account or using any part of our service, you agree
              to be bound by these Terms.
            </p>
            <p>
              Please read these Terms carefully. If you do not agree, you may not access or use Elix AI.
            </p>
          </div>

          <section className="legal-section">
            <h2><span className="legal-num">1.</span> Acceptance of Terms</h2>
            <p>
              By signing in, registering, or otherwise accessing Elix AI, you confirm that you are at least
              13 years of age, have read and understood these Terms, and agree to be legally bound by them.
              If you are using Elix AI on behalf of an organization, you represent that you have authority to
              bind that organization.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">2.</span> Description of Service</h2>
            <p>
              Elix AI provides an AI-powered conversational chat platform that allows users to interact with
              an AI assistant to assist with everyday tasks such as writing, answering questions, brainstorming,
              and more. Features include:
            </p>
            <ul>
              <li>AI chat powered by large language model technology.</li>
              <li>Google Sign-In authentication for secure access.</li>
              <li>Daily usage tracking and session management.</li>
              <li>A responsive, web-based interface accessible from any modern browser.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">3.</span> User Accounts</h2>
            <p>
              To use Elix AI, you must sign in using a valid Google account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the security of your Google account credentials.</li>
              <li>All activities that occur under your Elix AI session.</li>
              <li>Notifying us immediately of any unauthorized access to your account.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms without prior notice.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">4.</span> Acceptable Use</h2>
            <p>You agree to use Elix AI only for lawful purposes. You must <strong>not</strong>:</p>
            <ul>
              <li>Use the platform to generate harmful, abusive, threatening, defamatory, or illegal content.</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the platform or its underlying systems.</li>
              <li>Use the AI to impersonate real individuals or organizations.</li>
              <li>Submit content that violates any applicable laws or third-party rights.</li>
              <li>Use automated tools or bots to access the platform beyond normal usage.</li>
            </ul>
            <div className="legal-highlight">
              Violations of this Acceptable Use policy may result in immediate account suspension without refund
              or notice.
            </div>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">5.</span> AI-Generated Content</h2>
            <p>
              Elix AI uses AI to generate responses. Please be aware:
            </p>
            <ul>
              <li>AI responses may not always be accurate, complete, or current.</li>
              <li>Do not rely solely on AI responses for medical, legal, financial, or safety-critical decisions.</li>
              <li>We do not guarantee the accuracy or reliability of any AI-generated content.</li>
              <li>You retain responsibility for how you use or act upon AI responses.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">6.</span> Intellectual Property</h2>
            <p>
              All content, branding, design, and code of Elix AI — including the logo, interface, and original
              text — is the intellectual property of Elix AI and protected by applicable copyright laws.
            </p>
            <p>
              You may not copy, reproduce, distribute, or create derivative works from any part of the platform
              without our express written permission.
            </p>
            <p>
              Content you input into the AI chat remains your own. By submitting content, you grant Elix AI
              a limited license to process that content solely to deliver the service.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">7.</span> Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Elix AI and its creators shall not be liable for:
            </p>
            <ul>
              <li>Any indirect, incidental, special, or consequential damages arising from use of the platform.</li>
              <li>Loss of data, revenue, or business resulting from service interruptions.</li>
              <li>Actions taken based on AI-generated content.</li>
              <li>Unauthorized access to your account if caused by your failure to secure your credentials.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">8.</span> Service Availability</h2>
            <p>
              We strive to maintain high availability of Elix AI, but we do not guarantee uninterrupted access.
              The platform may be temporarily unavailable due to:
            </p>
            <ul>
              <li>Scheduled maintenance or updates.</li>
              <li>Third-party service disruptions (Google, Supabase, AI API providers).</li>
              <li>Unexpected technical issues or force majeure events.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">9.</span> Termination</h2>
            <p>
              You may stop using Elix AI at any time. We may suspend or terminate your access at our discretion
              if you violate these Terms. Upon termination, your right to use the service ceases immediately.
              Provisions that by their nature should survive termination (such as IP rights and liability
              limitations) shall continue in effect.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">10.</span> Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of significant changes by updating
              the "Last Updated" date. Continued use of the platform after changes are posted constitutes your
              acceptance of the updated Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">11.</span> Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with applicable laws. Any disputes shall
              be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to the
              appropriate courts of jurisdiction.
            </p>
          </section>

          <section className="legal-section">
            <h2><span className="legal-num">12.</span> Contact Us</h2>
            <p>For questions about these Terms, please contact:</p>
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
            <Link to="/privacy" className="legal-footer-link">Privacy Policy</Link>
            <Link to="/" className="legal-footer-link">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
