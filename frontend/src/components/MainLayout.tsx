import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg-surface text-text-base flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}