import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { RefreshCw, ServerOff } from 'lucide-react';

export const ServerErrorPage = () => {
  return (
    <div className="min-vh-100 bg-slate-900 text-white d-flex align-items-center justify-content-center py-5">
      <Container className="text-center max-w-md">
        <div className="d-inline-flex p-4 bg-warning bg-opacity-20 text-warning rounded-circle mb-4 shadow-lg border border-warning border-opacity-30">
          <ServerOff size={56} />
        </div>
        <h1 className="display-1 fw-extrabold font-monospace text-warning mb-2">500</h1>
        <h3 className="fw-bold text-white mb-2">Internal Server Error</h3>
        <p className="text-slate-400 text-sm mb-4">
          An unexpected error occurred on the backend server. Please refresh or try again later.
        </p>
        <Button onClick={() => window.location.reload()} variant="primary" className="rounded-3 px-4 py-2.5 fw-semibold shadow-sm d-inline-flex align-items-center gap-2">
          <RefreshCw size={18} /> Refresh Page
        </Button>
      </Container>
    </div>
  );
};
