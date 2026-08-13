import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { LayoutDashboard, ShieldAlert } from 'lucide-react';

export const AccessDeniedPage = () => {
  return (
    <div className="min-vh-100 bg-slate-900 text-white d-flex align-items-center justify-content-center py-5">
      <Container className="text-center max-w-md">
        <div className="d-inline-flex p-4 bg-danger bg-opacity-20 text-danger rounded-circle mb-4 shadow-lg border border-danger border-opacity-30">
          <ShieldAlert size={56} />
        </div>
        <h1 className="display-1 fw-extrabold font-monospace text-danger mb-2">403</h1>
        <h3 className="fw-bold text-white mb-2">Access Denied</h3>
        <p className="text-slate-400 text-sm mb-4">
          You don't have permission to perform this action or view this administrative area.
        </p>
        <Button as={Link} to="/dashboard" variant="primary" className="rounded-3 px-4 py-2.5 fw-semibold shadow-sm d-inline-flex align-items-center gap-2">
          <LayoutDashboard size={18} /> Return to Dashboard
        </Button>
      </Container>
    </div>
  );
};
