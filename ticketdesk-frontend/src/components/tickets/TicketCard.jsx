import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Calendar, MessageSquare, User } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/formatters';
import { CategoryBadge } from '../common/CategoryBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

export const TicketCard = ({ ticket }) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 transition-all card-hover overflow-hidden">
      <Card.Body className="p-4 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="font-monospace text-xs fw-bold text-primary">#{ticket.ticketNumber}</span>
            <StatusBadge status={ticket.status} size="sm" />
          </div>

          <h6 className="fw-bold text-slate-900 mb-2 line-clamp-2">
            <Link to={`/tickets/${ticket.id}`} className="text-slate-900 text-decoration-none hover-text-primary">
              {ticket.title}
            </Link>
          </h6>

          <p className="text-muted text-xs mb-3">{truncateText(ticket.description, 90)}</p>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <CategoryBadge category={ticket.category} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <div className="pt-3 border-top border-slate-100 d-flex align-items-center justify-content-between text-2xs text-muted">
          <div className="d-flex align-items-center gap-1">
            <User size={13} />
            <span>{ticket.createdBy?.fullName || 'Anonymous'}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="d-flex align-items-center gap-1">
              <MessageSquare size={13} /> {ticket.commentCount || 0}
            </span>
            <span className="d-flex align-items-center gap-1">
              <Calendar size={13} /> {formatDate(ticket.createdAt)}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
