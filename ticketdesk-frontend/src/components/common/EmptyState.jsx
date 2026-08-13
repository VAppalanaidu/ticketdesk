import React from 'react';
import { Button } from 'react-bootstrap';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  title = 'No tickets found',
  description = 'There are no records matching your current request or filters.',
  actionLabel,
  onAction,
  icon = <Inbox size={48} className="text-slate-400 mb-3" />,
}) => {
  return (
    <div className="text-center py-5 px-4 my-4 bg-light rounded-4 border border-dashed border-slate-300">
      <div className="d-inline-flex align-items-center justify-content-center p-3 bg-white rounded-circle shadow-sm mb-3">
        {icon}
      </div>
      <h5 className="fw-bold text-slate-800 mb-2">{title}</h5>
      <p className="text-muted text-sm max-w-md mx-auto mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="px-4 py-2 rounded-3 shadow-sm fw-semibold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
