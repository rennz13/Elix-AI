import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import elixLogo from './assets/logore.png';

// ── Icon Components ──────────────────────────────────────────────────────────

const IconChat = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const IconZap = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconGoogle = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 11h8.5c.2.9.3 1.8.3 2.8C20.8 18.5 17.1 22 12 22 6.5 22 2 17.5 2 12S6.5 2 12 2c2.7 0 5.1 1 6.9 2.7L16.5 7c-1.2-1.1-2.8-1.8-4.5-1.8-3.7 0-6.8 3-6.8 6.8s3 6.8 6.8 6.8c3.3 0 5.8-2 6.5-4.8H12v-3z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
  </svg>
);

const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSmile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconMobile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="1.8"/>
    <line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconBolt = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Intersection Observer Hook ────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── Chat Mockup ───────────────────────────────────────────────────────────────
function ChatMockup() {
  const messages = [
    { role: 'user', text: 'Can you help me write a professional email?' },
    { role: 'ai', text: 'Absolutely! I\'d be happy to help you craft a polished, professional email. What\'s the context?' },
    { role: 'user', text: 'It\'s for a job application at a tech startup.' },
    { role: 'ai', text: 'Perfect. Here\'s a clean opening:\n\n"Dear Hiring Team,\nI\'m excited to apply for this role…"' },
  ];

  return (
    <div className="chat-mockup">
      <div className="mockup-header">
        <div className="mockup-dots">
          <span className="dot dot-red" /><span className="dot dot-yellow" /><span className="dot dot-green" />
        </div>
        <div className="mockup-title">
          <img src={elixLogo} alt="logo" className="mockup-logo" />
          <span>Elix AI</span>
        </div>
        <div className="mockup-status"><span className="status-dot" />Online</div>
      </div>
      <div className="mockup-body">
        {messages.map((msg, i) => (
          <div key={i} className={`mockup-msg ${msg.role}`} style={{ animationDelay: `${0.6 + i * 0.25}s` }}>
            {msg.role === 'ai' && <div className="ai-avatar"><img src={elixLogo} alt="AI" /></div>}
            <div className="msg-bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="mockup-input-bar">
        <div className="mockup-input-field">Ask me anything…</div>
        <button className="mockup-send" aria-label="send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  // Reveal refs
  const [featRef, featVisible] = useReveal();
  const [howRef, howVisible] = useReveal();
  const [whyRef, whyVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: <IconChat />, title: 'AI Chat Assistant', desc: 'Engage in natural, context-aware conversations powered by cutting-edge language models.' },
    { icon: <IconZap />, title: 'Fast & Simple', desc: 'Get responses in seconds. No complexity, no friction — just clean, instant AI assistance.' },
    { icon: <IconGoogle />, title: 'Google Sign-In', desc: 'One-click authentication with your Google account. Secure, fast, and hassle-free.' },
    { icon: <IconChart />, title: 'Usage Tracking', desc: 'Monitor your daily chat activity with an elegant dashboard designed for clarity.' },
  ];

  const steps = [
    { num: '01', title: 'Sign In', desc: 'Authenticate securely with your Google account in one click.' },
    { num: '02', title: 'Start a Chat', desc: 'Open a new conversation and greet your AI assistant.' },
    { num: '03', title: 'Ask Anything', desc: 'Type your question, task, or idea — no limits on topics.' },
    { num: '04', title: 'Get Answers', desc: 'Receive smart, instant AI responses ready to use.' },
  ];

  const benefits = [
    { icon: <IconSmile />, text: 'Simple and user-friendly design' },
    { icon: <IconBolt />, text: 'Fast and reliable AI responses' },
    { icon: <IconShield />, text: 'Secure authentication system' },
    { icon: <IconMobile />, text: 'Works on desktop and mobile' },
  ];

  return (
    <div className="landing-root">

      {/* ── Animated Background Orbs ── */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ═══════════════════════════════════════
          1. NAVBAR
      ═══════════════════════════════════════ */}
      <nav className={`landing-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-brand" onClick={() => { setActiveLink(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src={elixLogo} alt="Elix AI" className="nav-logo" />
            <span className="nav-brand-name">Elix AI</span>
          </Link>

          <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
            <a href="#features" className={`nav-link ${activeLink === 'features' ? 'nav-link-active' : ''}`} onClick={() => { setMenuOpen(false); setActiveLink('features'); }}>Features</a>
            <a href="#how" className={`nav-link ${activeLink === 'how' ? 'nav-link-active' : ''}`} onClick={() => { setMenuOpen(false); setActiveLink('how'); }}>How It Works</a>
            <a href="#why" className={`nav-link ${activeLink === 'why' ? 'nav-link-active' : ''}`} onClick={() => { setMenuOpen(false); setActiveLink('why'); }}>About</a>
            <Link to="/login" className="nav-btn-signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/login" className="nav-btn-start" onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>

          <button className="nav-hamburger" aria-label="menu" onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          2. HERO
      ═══════════════════════════════════════ */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">✦ AI-Powered Platform</div>
            <h1 className="hero-headline">
              Your Smart AI Assistant<br />
              <span className="hero-gradient-text">for Everyday Tasks</span>
            </h1>
            <p className="hero-sub">
              Elix AI helps you chat, create, and solve problems instantly using
              powerful AI in one simple, elegant platform.
            </p>
            <div className="hero-ctas">
              <Link to="/login" className="btn-primary-hero">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/login" className="btn-ghost-hero">Sign In</Link>
            </div>

          </div>
          <div className="hero-visual">
            <ChatMockup />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. FEATURES
      ═══════════════════════════════════════ */}
      <section id="features" className="section features-section" ref={featRef}>
        <div className="section-inner">
          <div className={`section-header ${featVisible ? 'revealed' : ''}`}>
            <div className="section-badge">Features</div>
            <h2 className="section-title">Everything you need, nothing you don't</h2>
            <p className="section-sub">Four powerful pillars that make Elix AI the smartest choice for everyday AI needs.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card ${featVisible ? 'revealed' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section id="how" className="section how-section" ref={howRef}>
        <div className="section-inner">
          <div className={`section-header ${howVisible ? 'revealed' : ''}`}>
            <div className="section-badge">Process</div>
            <h2 className="section-title">Up and running in minutes</h2>
            <p className="section-sub">Four simple steps to start conversing with AI.</p>
          </div>
          <div className="steps-row">
            {steps.map((s, i) => (
              <div key={i} className={`step-item ${howVisible ? 'revealed' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="step-num-wrap">
                  <div className="step-num">{s.num}</div>
                  {i < steps.length - 1 && <div className="step-connector" />}
                </div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. WHY CHOOSE ELIX AI
      ═══════════════════════════════════════ */}
      <section id="why" className="section why-section" ref={whyRef}>
        <div className="section-inner why-inner">
          <div className={`why-text ${whyVisible ? 'revealed' : ''}`}>
            <div className="section-badge">Why Elix AI</div>
            <h2 className="section-title">Built for people who value their time</h2>
            <p className="section-sub">
              We obsessed over every detail so you don't have to. Elix AI is designed
              to be fast, secure, and a pleasure to use every single day.
            </p>
            <div className="benefits-list">
              {benefits.map((b, i) => (
                <div key={i} className={`benefit-item ${whyVisible ? 'revealed' : ''}`} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  <div className="benefit-icon">{b.icon}</div>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`why-visual ${whyVisible ? 'revealed' : ''}`}>
            <div className="why-card-stack">
              <div className="why-card wc-1">
                <div className="wc-label">Response Speed</div>
                <div className="wc-bar-wrap">
                  <div className="wc-bar" style={{ '--w': '92%' }} />
                </div>
                <span className="wc-val">0.8s avg</span>
              </div>
              <div className="why-card wc-2">
                <div className="wc-label">User Satisfaction</div>
                <div className="wc-bar-wrap">
                  <div className="wc-bar" style={{ '--w': '97%' }} />
                </div>
                <span className="wc-val">97%</span>
              </div>
              <div className="why-card wc-3">
                <div className="wc-label">System Uptime</div>
                <div className="wc-bar-wrap">
                  <div className="wc-bar wc-bar-green" style={{ '--w': '99%' }} />
                </div>
                <span className="wc-val">99.9%</span>
              </div>
              <div className="why-glow-badge">
                <img src={elixLogo} alt="Elix AI" />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. CTA
      ═══════════════════════════════════════ */}
      <section id="cta" className="section cta-section" ref={ctaRef}>
        <div className={`cta-card ${ctaVisible ? 'revealed' : ''}`}>
          <div className="cta-glow" />
          <div className="section-badge">Get Started</div>
          <h2 className="cta-title">Start chatting with AI today</h2>
          <p className="cta-sub">Join Elix AI and experience smarter conversations instantly.</p>
          <Link to="/login" className="btn-cta-pulse">
            Get Started Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. FOOTER
      ═══════════════════════════════════════ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={elixLogo} alt="Elix AI" className="footer-logo" />
            <div>
              <div className="footer-brand-name">Elix AI</div>
              <div className="footer-tagline">Smart AI Chat Platform</div>
            </div>
          </div>
          <div className="footer-links">
            <a href="#why" className="footer-link">About</a>
            <a href="mailto:contact@elixai.com" className="footer-link">Contact</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
          </div>
          <div className="footer-copy">© 2026 Elix AI. All rights reserved.</div>
          <div className="footer-copy" style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.5 }}>Developed by Rence</div>
        </div>
      </footer>

    </div>
  );
}
