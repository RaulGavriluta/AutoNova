import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}