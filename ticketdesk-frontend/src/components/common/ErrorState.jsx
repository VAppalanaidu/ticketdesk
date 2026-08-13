import React from 'react';
import { Button } from 'react-bootstrap';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to fetch data from backend. Please check connection and try again.',
  onRetry,
}) => {
  return (
    <div className="text-center py-5 px-4 my-4 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-4">
      <div className="d-inline-flex align-items-center justify-content-center p-3 bg-white rounded-circle text-danger shadow-sm mb-3">
        <AlertTriangle size={40} />
      </div>
      <h5 className="fw-bold text-danger mb-2">{title}</h5>
      <p className="text-slate-600 text-sm max-w-md mx-auto mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry} className="px-4 py-2 rounded-3 shadow-sm d-inline-flex align-items-center gap-2">
          <RefreshCw size={16} /> Retry
        </Button>
      )}
    </div>
  );
};
