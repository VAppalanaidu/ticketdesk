import React from 'react';
import { Card } from 'react-bootstrap';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Ticket } from 'lucide-react';

export const WorkflowStepper = ({ stats }) => {
  const steps = [
    { key: 'OPEN', label: 'OPEN', count: stats?.openTickets || 0, color: 'info', icon: <Ticket size={20} /> },
    { key: 'IN_PROGRESS', label: 'IN PROGRESS', count: stats?.inProgressTickets || 0, color: 'warning', icon: <Clock size={20} /> },
    { key: 'RESOLVED', label: 'RESOLVED', count: stats?.resolvedTickets || 0, color: 'success', icon: <CheckCircle2 size={20} /> },
    { key: 'CLOSED', label: 'CLOSED', count: stats?.closedTickets || 0, color: 'secondary', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
      <Card.Body className="p-0">
        <h5 className="fw-bold text-slate-800 mb-3">Ticket Lifecycle & Workflow State</h5>
        <div className="row g-3 align-items-center">
          {steps.map((step, idx) => (
            <React.Fragment key={step.key}>
              <div className="col-12 col-sm-6 col-md">
                <div className={`p-3 rounded-4 bg-${step.color} bg-opacity-10 border border-${step.color} border-opacity-25 d-flex align-items-center justify-content-between`}>
                  <div className="d-flex align-items-center gap-2.5">
                    <div className={`p-2 rounded-circle bg-${step.color} text-white shadow-2xs`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-2xs fw-bold font-monospace text-slate-600 text-uppercase">{step.label}</div>
                      <div className="h4 fw-extrabold mb-0 text-slate-900 font-monospace">{step.count}</div>
                    </div>
                  </div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="col-auto d-none d-md-block text-slate-300">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};
