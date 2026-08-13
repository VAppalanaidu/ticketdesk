import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-vh-100 bg-slate-900 text-white d-flex align-items-center justify-content-center py-5">
      <Container className="text-center max-w-md">
        <div className="d-inline-flex p-4 bg-slate-800 text-primary rounded-circle mb-4 shadow-lg border border-slate-700">
          <FileQuestion size={56} />
        </div>
        <h1 className="display-1 fw-extrabold font-monospace text-slate-400 mb-2">404</h1>
        <h3 className="fw-bold text-white mb-2">Page Not Found</h3>
        <p className="text-slate-400 text-sm mb-4">
          The page or resource you are looking for doesn't exist, has been removed, or moved to another URL.
        </p>
        <div className="d-flex justify-content-center gap-3">
          {isAuthenticated ? (
            <Button as={Link} to="/dashboard" variant="primary" className="rounded-3 px-4 py-2.5 fw-semibold shadow-sm d-inline-flex align-items-center gap-2">
              <LayoutDashboard size={18} /> Go to Dashboard
            </Button>
          ) : (
            <Button as={Link} to="/" variant="primary" className="rounded-3 px-4 py-2.5 fw-semibold shadow-sm d-inline-flex align-items-center gap-2">
              <Home size={18} /> Go to Home
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};
