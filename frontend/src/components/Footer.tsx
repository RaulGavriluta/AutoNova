import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-main mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-2xl font-custom font-bold text-primary tracking-tight">
            AutoNova
          </Link>
          <p className="text-text-muted font-body-custom text-sm leading-relaxed">
            Premium e-commerce platform engineered for high-end automotive parts and component sourcing.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-sm font-custom font-bold text-text-base uppercase tracking-wider mb-4">
            Shop
          </h3>
          <ul className="space-y-2 font-body-custom text-sm">
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Braking Systems
              </Link>
            </li>
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Filters & Maintenance
              </Link>
            </li>
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Suspension & Steering
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-sm font-custom font-bold text-text-base uppercase tracking-wider mb-4">
            Support
          </h3>
          <ul className="space-y-2 font-body-custom text-sm">
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-sm font-custom font-bold text-text-base uppercase tracking-wider mb-4">
            Legal
          </h3>
          <ul className="space-y-2 font-body-custom text-sm">
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/" className="text-text-muted hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-primary/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-body-custom text-text-muted">
          <p>&copy; {currentYear} AutoNova. All rights reserved.</p>
          <p className="text-xs">Engineered for Performance.</p>
        </div>
      </div>
    </footer>
  );
}