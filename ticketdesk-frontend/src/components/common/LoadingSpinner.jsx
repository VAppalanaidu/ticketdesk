import React from 'react';
import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = ({
  label = 'Loading...',
  fullScreen = false,
  size = 'md',
}) => {
  const spinnerSize = size === 'sm' ? 'sm' : undefined;

  if (fullScreen) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center bg-slate-900 text-white min-vh-100 position-fixed top-0 start-0 w-100 z-3"
        style={{ opacity: 0.95 }}
      >
        <Spinner animation="border" variant="primary" role="status" className="mb-3" />
        <p className="text-slate-300 font-monospace text-sm">{label}</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" size={spinnerSize} role="status" className="mb-2" />
      {label && <span className="text-muted text-xs font-monospace">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
