import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/tickets') return 'Ticket Directory';
    if (path === '/tickets/create') return 'Create New Ticket';
    if (path.startsWith('/tickets/')) return 'Ticket Detail';
    if (path === '/users') return 'User Management';
    if (path === '/profile') return 'User Profile';
    return 'TicketDesk';
  };

  return (
    <div className="d-flex min-vh-100 bg-slate-50">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="main-content-wrapper flex-grow-1 d-flex flex-column min-vh-100">
        <Header onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} title={getPageTitle()} />
        <main className="flex-grow-1 p-4 p-md-5">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
