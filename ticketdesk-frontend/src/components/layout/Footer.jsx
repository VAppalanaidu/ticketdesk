import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-3 px-4 bg-white border-top text-center text-md-start">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-xs text-muted">
        <div>
          <span className="fw-semibold text-slate-700">TicketDesk</span> &copy; {new Date().getFullYear()} Enterprise IT Support Tracker. All rights reserved.
        </div>
        <div className="d-flex align-items-center gap-3 font-monospace">
          <span>v1.0.0</span>
          <span>•</span>
          <span>REST API Ready</span>
        </div>
      </div>
    </footer>
  );
};
