import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-extrabold text-blue-400 tracking-tight">AutoNova</Link>
      <div className="flex gap-6 font-medium">
        <Link to="/" className="hover:text-blue-400 transition-colors">Catalog</Link>
        <Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
        <Link to="/register" className="hover:text-purple-400 transition-colors">Register</Link>
      </div>
    </nav>
  );
}