import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `font-body font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-sm shadow-primary/20'
        : 'text-text-muted hover:text-primary hover:bg-primary/5'
    }`;

  return (
    <nav className="bg-bg-surface border-b border-brand-border px-8 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <NavLink to="/" className="text-2xl font-display font-bold text-primary tracking-tight">
          AutoNova
        </NavLink>
      </div>

      <div className="flex items-center gap-2">
        <NavLink to="/" className={linkStyles}>
          Catalog
        </NavLink>
        <NavLink to="/login" className={linkStyles}>
          Login
        </NavLink>
        <NavLink to="/register" className={linkStyles}>
          Register
        </NavLink>
      </div>
    </nav>
  );
}