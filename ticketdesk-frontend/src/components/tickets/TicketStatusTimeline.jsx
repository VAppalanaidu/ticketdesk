import React from 'react';
import { Card } from 'react-bootstrap';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const STATUS_STEPS = [
  { key: 'OPEN', label: 'Ticket Opened' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
  { key: 'CLOSED', label: 'Closed' },
];

export const TicketStatusTimeline = ({ ticket }) => {
  if (!ticket) return null;

  const currentStatus = ticket.status;
  const historyList = ticket.statusHistory || [];

  // Determine step index for current status
  const getStepIndex = (statusKey) => {
    switch (statusKey) {
      case 'OPEN':
        return 0;
      case 'IN_PROGRESS':
        return 1;
      case 'RESOLVED':
        return 2;
      case 'CLOSED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  // Helper to find history event for a given status
  const getStatusEvent = (statusKey) => {
    // Check history records first
    const match = historyList.find((h) => h.status === statusKey);
    if (match) return match;

    // Fallbacks from ticket timestamps
    if (statusKey === 'OPEN') {
      return { createdAt: ticket.createdAt, changedBy: ticket.createdBy };
    }
    if (statusKey === 'CLOSED' && ticket.closedAt) {
      return { createdAt: ticket.closedAt, changedBy: null };
    }
    return null;
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
      <Card.Body className="p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h5 className="fw-bold text-slate-900 mb-0">Ticket Progress Journey</h5>
            <span className="text-muted text-xs">Real-time lifecycle and audit history timestamps</span>
          </div>
          <span className="badge bg-primary bg-opacity-10 text-primary font-monospace px-3 py-1.5 rounded-pill fw-semibold">
            Status: {currentStatus}
          </span>
        </div>

        {/* Desktop View: Horizontal Railway Track */}
        <div className="d-none d-md-block py-3">
          <div className="d-flex align-items-center justify-content-between position-relative px-4">
            {/* Connecting Railway Track Line */}
            <div
              className="position-absolute top-50 start-0 w-100 translate-middle-y bg-slate-200 z-0"
              style={{ height: '4px', left: '10%', width: '80%' }}
            />
            {/* Active Progress Track Line */}
            <div
              className="position-absolute top-50 start-0 translate-middle-y bg-primary z-0 transition-all"
              style={{
                height: '4px',
                left: '10%',
                width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 80}%`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isPending = idx > currentStepIdx;
              const event = getStatusEvent(step.key);

              return (
                <div key={step.key} className="text-center z-1 bg-white px-2">
                  <div className="d-inline-flex align-items-center justify-content-center mb-2">
                    {isCompleted ? (
                      <div className="bg-success text-white rounded-circle p-2 shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                    ) : isCurrent ? (
                      <div className="bg-primary text-white rounded-circle p-2 shadow-md animate-pulse">
                        <Clock size={24} />
                      </div>
                    ) : (
                      <div className="bg-slate-100 text-slate-400 rounded-circle p-2 border border-slate-300">
                        <Circle size={24} />
                      </div>
                    )}
                  </div>
                  <h6
                    className={`fw-bold mb-1 text-xs ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h6>

                  {/* Timestamp & User */}
                  <div className="text-2xs font-monospace text-slate-500" style={{ minHeight: '36px' }}>
                    {event?.createdAt ? (
                      <div>
                        <div>{formatDate(event.createdAt)}</div>
                        {event.changedBy?.fullName && (
                          <div className="text-slate-400">by {event.changedBy.fullName}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-300">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View: Vertical Timeline Journey */}
        <div className="d-md-none py-2">
          <div className="position-relative ps-4 ms-2">
            {/* Vertical Line */}
            <div
              className="position-absolute top-0 start-0 h-100 bg-slate-200"
              style={{ width: '2px', left: '7px' }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const event = getStatusEvent(step.key);

              return (
                <div key={step.key} className="position-relative mb-4 pb-1">
                  {/* Circle Icon */}
                  <div
                    className="position-absolute top-0 start-0 translate-middle-x bg-white"
                    style={{ left: '-15px' }}
                  >
                    {isCompleted ? (
                      <div className="bg-success text-white rounded-circle p-1">
                        <CheckCircle2 size={16} />
                      </div>
                    ) : isCurrent ? (
                      <div className="bg-primary text-white rounded-circle p-1 animate-pulse">
                        <Clock size={16} />
                      </div>
                    ) : (
                      <div className="bg-slate-100 text-slate-400 rounded-circle p-1 border">
                        <Circle size={16} />
                      </div>
                    )}
                  </div>

                  <div className="ps-3">
                    <h6
                      className={`fw-bold mb-0 text-sm ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-success' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h6>
                    <div className="text-2xs font-monospace text-slate-500">
                      {event?.createdAt ? (
                        <span>
                          {formatDate(event.createdAt)}{' '}
                          {event.changedBy?.fullName ? `by ${event.changedBy.fullName}` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-300">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
