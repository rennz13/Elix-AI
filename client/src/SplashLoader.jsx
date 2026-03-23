import elixLogo from './assets/logore.png';
import './SplashLoader.css';

export default function SplashLoader() {
  return (
    <div className="splash-root">
      <div className="splash-center">
        {/* Outer glow ring */}
        <div className="splash-ring splash-ring--outer" />
        {/* Inner spinning arc */}
        <div className="splash-ring splash-ring--inner" />
        {/* Logo */}
        <div className="splash-logo-wrap">
          <img src={elixLogo} alt="Elix AI" className="splash-logo" />
        </div>
      </div>
      <p className="splash-label">Elix AI</p>
      <p className="splash-sub">Loading your workspace…</p>
    </div>
  );
}
