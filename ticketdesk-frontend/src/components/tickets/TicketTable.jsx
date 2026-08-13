import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { Eye, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

export const TicketTable = ({ tickets = [], onOpenAssignModal, canAssign = false }) => {
  return (
    <div className="table-responsive">
      <Table hover align="middle" className="mb-0 bg-white rounded-4 shadow-sm overflow-hidden text-sm">
        <thead className="table-light">
          <tr>
            <th className="font-monospace text-xs text-uppercase ps-4 py-3">ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Assigned To</th>
            <th>Created Date</th>
            <th className="text-end pe-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td className="ps-4 font-monospace fw-bold text-primary">#{t.ticketNumber}</td>
              <td className="fw-semibold text-slate-900" style={{ maxWidth: 240 }}>
                <Link to={`/tickets/${t.id}`} className="text-slate-900 text-decoration-none hover-text-primary">
                  {t.title}
                </Link>
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
              <td className="text-slate-700 text-xs">{t.createdBy?.fullName || 'N/A'}</td>
              <td className="text-xs">
                {t.assignedTo ? (
                  <span className="fw-medium text-slate-800">{t.assignedTo.fullName}</span>
                ) : (
                  <span className="badge bg-light text-muted border font-monospace">Unassigned</span>
                )}
              </td>
              <td className="text-muted text-xs font-monospace">{formatDate(t.createdAt)}</td>
              <td className="text-end pe-4">
                <div className="d-flex align-items-center justify-content-end gap-1.5">
                  {canAssign && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onOpenAssignModal(t)}
                      title="Assign Engineer"
                      className="rounded-3 p-1.5 shadow-2xs"
                    >
                      <UserCheck size={16} />
                    </Button>
                  )}
                  <Button
                    as={Link}
                    to={`/tickets/${t.id}`}
                    variant="primary"
                    size="sm"
                    className="rounded-3 p-1.5 shadow-2xs"
                    title="View Ticket Details"
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
