import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Headphones, ShieldCheck, Zap } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-vh-100 bg-slate-900 d-flex flex-column justify-content-between text-slate-100">
      {/* Top Brand Nav */}
      <nav className="navbar py-4 px-4 px-md-5">
        <div className="container-fluid max-w-7xl">
          <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none">
            <div className="bg-primary p-2 rounded-3 text-white shadow-lg d-flex align-items-center justify-content-center">
              <Headphones size={24} />
            </div>
            <div>
              <span className="fw-bold text-white fs-4 font-monospace">TicketDesk</span>
              <span className="d-block text-2xs text-slate-400 font-monospace text-uppercase tracking-wider">
                IT Support Portal
              </span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Main Auth Form Container */}
      <div className="container py-4 flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: '440px' }}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-slate-400 text-xs font-monospace border-top border-slate-800">
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} TicketDesk Enterprise IT Support. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
