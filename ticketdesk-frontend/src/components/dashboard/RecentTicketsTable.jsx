import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Table } from 'react-bootstrap';
import { ArrowRight, Eye } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

export const RecentTicketsTable = ({ tickets = [] }) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
      <Card.Body className="p-0">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-slate-800 mb-0">Recent Tickets</h5>
          <Button as={Link} to="/tickets" variant="link" className="p-0 text-decoration-none fw-semibold text-sm d-flex align-items-center gap-1">
            View All <ArrowRight size={16} />
          </Button>
        </div>

        {tickets.length === 0 ? (
          <p className="text-muted text-sm py-4 text-center mb-0">No recent tickets to display.</p>
        ) : (
          <div className="table-responsive">
            <Table hover align="middle" className="mb-0 text-sm">
              <thead className="table-light">
                <tr>
                  <th className="font-monospace text-xs text-uppercase">Ticket ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="font-monospace fw-bold text-primary">#{t.ticketNumber}</td>
                    <td className="fw-semibold text-slate-800 text-truncate" style={{ maxWidth: 200 }}>
                      {t.title}
                    </td>
                    <td>
                      <CategoryBadge category={t.category} />
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td>
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="text-muted text-xs font-monospace">{formatDate(t.createdAt)}</td>
                    <td className="text-end">
                      <Button
                        as={Link}
                        to={`/tickets/${t.id}`}
                        variant="light"
                        size="sm"
                        className="rounded-3 p-1.5 border text-slate-600 shadow-2xs"
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
