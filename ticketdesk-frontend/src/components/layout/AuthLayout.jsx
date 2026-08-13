import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Headphones, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-vh-100 d-flex flex-column justify-content-between transition-all ${
      isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Brand Nav with Theme Switcher */}
      <nav className="navbar py-3 px-4 px-md-5">
        <div className="container-fluid max-w-7xl d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none">
            <div className="bg-primary p-2 rounded-3 text-white shadow-sm d-flex align-items-center justify-content-center">
              <Headphones size={22} />
            </div>
            <div>
              <span className={`fw-bold fs-4 font-monospace ${isDark ? 'text-white' : 'text-slate-900'}`}>
                TicketDesk
              </span>
              <span className={`d-block text-2xs font-monospace text-uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                IT Support Portal
              </span>
            </div>
          </Link>

          {/* Theme Toggle Button on Auth Navbar */}
          <button
            onClick={toggleTheme}
            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border fw-medium transition-all shadow-sm ${
              isDark
                ? 'btn-outline-light border-slate-700 bg-slate-800 text-warning hover-bg-slate-700'
                : 'btn-outline-secondary border-slate-300 bg-white text-slate-700 hover-bg-slate-100'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {isDark ? (
              <>
                <Sun size={16} className="text-warning fill-warning" />
                <span className="text-xs d-none d-sm-inline fw-semibold text-slate-200">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={16} className="text-indigo-600 fill-indigo-600" />
                <span className="text-xs d-none d-sm-inline fw-semibold text-slate-700">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Auth Form Container */}
      <div className="container py-4 flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: '440px' }}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className={`py-3 text-center text-xs font-monospace border-top ${
        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="container">
          <p className="mb-0">&copy; {new Date().getFullYear()} TicketDesk Enterprise IT Support. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
