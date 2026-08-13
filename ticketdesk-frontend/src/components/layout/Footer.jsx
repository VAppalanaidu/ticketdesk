import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`py-3 px-4 border-top text-center text-md-start transition-all ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
    }`}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-xs">
        <div>
          <span className={`fw-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>TicketDesk</span> &copy; {new Date().getFullYear()} Enterprise IT Support Tracker. All rights reserved.
        </div>
        <div className={`d-flex align-items-center gap-3 font-monospace ${isDark ? 'text-slate-400' : 'text-muted'}`}>
          <span>v1.0.0</span>
          <span>•</span>
          <span>REST API Ready</span>
        </div>
      </div>
    </footer>
  );
};
