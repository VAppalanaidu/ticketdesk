import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import {
  ArrowLeft,
  Clock,
  Paperclip,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { attachmentService } from '../../services/attachmentService';
import { ticketService } from '../../services/ticketService';
import { formatDate } from '../../utils/formatters';
import { AttachmentCard } from '../../components/attachments/AttachmentCard';
import { AttachmentUploader } from '../../components/attachments/AttachmentUploader';

import { CategoryBadge } from '../../components/common/CategoryBadge';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ErrorState } from '../../components/common/ErrorState';

import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CommentThread } from '../../components/comments/CommentThread';
import { AssignEngineerModal } from '../../components/tickets/AssignEngineerModal';
import { StatusTransitionModal } from '../../components/tickets/StatusTransitionModal';
import { TicketStatusTimeline } from '../../components/tickets/TicketStatusTimeline';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'SUPPORT_ENGINEER';
  const isAdmin = user?.role === 'ADMIN';

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningEngineer, setAssigningEngineer] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTicket, setDeletingTicket] = useState(false);

  // Attachment upload on existing ticket
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const fetchTicketDetail = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      console.error('Failed to load ticket detail', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicketDetail();
    }
  }, [id]);

  const handleStatusUpdate = async (nextStatus) => {
    setUpdatingStatus(true);
    try {
      await ticketService.updateStatus(ticket.id, { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
      setShowStatusModal(false);
      await fetchTicketDetail();
    } catch (err) {
      toast.error('Failed to update ticket status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAssignEngineer = async (engineerId) => {
    setAssigningEngineer(true);
    try {
      const updatedTicket = await ticketService.assignEngineer(ticket.id, { engineerId });
      toast.success('Ticket assigned successfully');
      setShowAssignModal(false);
      if (updatedTicket) {
        setTicket(updatedTicket);
      } else {
        await fetchTicketDetail();
      }
    } catch (err) {
      toast.error('Failed to assign ticket');
    } finally {
      setAssigningEngineer(false);
    }
  };

  const handleDeleteTicket = async () => {
    setDeletingTicket(true);
    try {
      await ticketService.deleteTicket(ticket.id);
      toast.success('Ticket deleted successfully');
      navigate('/tickets');
    } catch (err) {
      toast.error('Failed to delete ticket');
    } finally {
      setDeletingTicket(false);
    }
  };

  const handleUploadAttachment = async () => {
    if (!selectedUploadFile) return;
    setUploadingAttachment(true);
    try {
      await attachmentService.uploadAttachment(ticket.id, selectedUploadFile);
      toast.success('Attachment uploaded successfully');
      setSelectedUploadFile(null);
      await fetchTicketDetail();
    } catch (err) {
      toast.error('Failed to upload attachment');
    } finally {
      setUploadingAttachment(false);
    }
  };

  const handleDeleteAttachment = async () => {
    try {
      await attachmentService.deleteAttachment(ticket.id);
      toast.success('Attachment removed');
      await fetchTicketDetail();
    } catch (err) {
      toast.error('Failed to remove attachment');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading ticket details..." />;
  }

  if (error || !ticket) {
    return <ErrorState title="Ticket Not Found" message="The requested ticket ID does not exist or you do not have permission to view it." onRetry={fetchTicketDetail} />;
  }

  const isCreator = user?.id === ticket.createdBy?.id;
  const canDelete = isAdmin || isCreator;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Breadcrumb & Action Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <Link to="/tickets" className="text-slate-600 text-xs font-semibold text-decoration-none d-inline-flex align-items-center gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Tickets
          </Link>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <span className="font-monospace fw-bold text-primary fs-4">#{ticket.ticketNumber}</span>
            <StatusBadge status={ticket.status} size="lg" />
            <PriorityBadge priority={ticket.priority} />
            <CategoryBadge category={ticket.category} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {isStaff && (
            <Button
              variant="outline-primary"
              onClick={() => setShowStatusModal(true)}
              className="rounded-3 px-3 py-2 text-sm fw-semibold shadow-2xs d-inline-flex align-items-center gap-1.5"
            >
              <Clock size={16} /> Change Status
            </Button>
          )}

          {isStaff && (
            <Button
              variant="outline-secondary"
              onClick={() => setShowAssignModal(true)}
              className="rounded-3 px-3 py-2 text-sm fw-semibold shadow-2xs d-inline-flex align-items-center gap-1.5"
            >
              <UserCheck size={16} /> Assign Engineer
            </Button>
          )}

          {canDelete && (
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteModal(true)}
              className="rounded-3 p-2 shadow-2xs"
              title="Delete Ticket"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Ticket Railway Status Journey Timeline */}
      <TicketStatusTimeline ticket={ticket} />

      <Row className="g-4">
        {/* Main Content Column */}
        <Col xs={12} lg={8}>
          {/* Ticket Information Card */}
          <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
            <Card.Body className="p-0">
              <h4 className="fw-bold text-slate-900 mb-3">{ticket.title}</h4>
              <div className="p-4 bg-slate-50 rounded-3 border border-slate-200 mb-4">
                <h6 className="fw-bold text-slate-700 text-xs font-monospace text-uppercase mb-2">Issue Description</h6>
                <p className="text-slate-800 text-sm mb-0 whitespace-pre-line lh-relaxed">{ticket.description}</p>
              </div>

              {/* Attachment Display or Uploader */}
              <div className="mt-4 pt-3 border-top border-slate-100">
                <h6 className="fw-bold text-slate-900 text-sm mb-3 d-flex align-items-center gap-2">
                  <Paperclip size={18} className="text-primary" /> Attachment
                </h6>
                {ticket.attachment ? (
                  <AttachmentCard
                    attachment={ticket.attachment}
                    onDelete={handleDeleteAttachment}
                    canDelete={isCreator || isAdmin}
                  />
                ) : (
                  <div className="bg-light p-3 rounded-3 border">
                    <p className="text-muted text-xs mb-2">No attachment uploaded yet for this ticket.</p>
                    <AttachmentUploader
                      selectedFile={selectedUploadFile}
                      onFileSelect={(f) => setSelectedUploadFile(f)}
                      onFileRemove={() => setSelectedUploadFile(null)}
                    />
                    {selectedUploadFile && (
                      <div className="mt-3 text-end">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleUploadAttachment}
                          disabled={uploadingAttachment}
                          className="rounded-3 px-4 fw-semibold"
                        >
                          {uploadingAttachment ? 'Uploading...' : 'Upload Attachment'}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Threaded Comments */}
          <CommentThread ticketId={ticket.id} />
        </Col>

        {/* Sidebar Info Column */}
        <Col xs={12} lg={4}>
          {/* Assigned Support Engineer Highlight Card */}
          <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-slate-900 text-white border border-slate-800">
            <Card.Body className="p-0">
              <span className="text-2xs font-monospace text-slate-400 text-uppercase fw-semibold d-block mb-2">
                Assigned Support Engineer
              </span>
              {ticket.assignedTo ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar bg-primary text-white rounded-circle fw-bold fs-5 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    {ticket.assignedTo.fullName ? ticket.assignedTo.fullName[0].toUpperCase() : 'S'}
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="fw-bold mb-0 text-white text-truncate">{ticket.assignedTo.fullName}</h6>
                    <span className="text-slate-400 text-xs d-block text-truncate">{ticket.assignedTo.email}</span>
                    <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 text-2xs mt-1">
                      Support Engineer
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-800 rounded-3 text-center border border-slate-700">
                  <UserX size={24} className="text-slate-400 mb-1" />
                  <span className="d-block text-xs font-semibold text-slate-300">Unassigned</span>
                  <span className="text-2xs text-slate-500">Waiting for assignment</span>
                  {isStaff && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowAssignModal(true)}
                      className="mt-2 text-2xs rounded-pill px-3 py-1 fw-bold w-100"
                    >
                      Assign Engineer Now
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Ticket Information Card */}
          <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
            <Card.Body className="p-0">
              <h6 className="fw-bold text-slate-900 mb-3 pb-2 border-bottom border-slate-100">Ticket Overview</h6>

              <div className="d-flex flex-column gap-3 text-sm">
                <div>
                  <span className="text-slate-400 text-2xs font-monospace text-uppercase d-block mb-1">Created By</span>
                  <div className="fw-semibold text-slate-800">{ticket.createdBy?.fullName || 'N/A'}</div>
                  <span className="text-muted text-xs">{ticket.createdBy?.email}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-2xs font-monospace text-uppercase d-block mb-1">Creation Timestamp</span>
                  <span className="font-monospace text-xs text-slate-700">{formatDate(ticket.createdAt)}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-2xs font-monospace text-uppercase d-block mb-1">Last Updated</span>
                  <span className="font-monospace text-xs text-slate-700">{formatDate(ticket.updatedAt)}</span>
                </div>

                {ticket.closedAt && (
                  <div>
                    <span className="text-slate-400 text-2xs font-monospace text-uppercase d-block mb-1">Closed Timestamp</span>
                    <span className="font-monospace text-xs text-slate-700">{formatDate(ticket.closedAt)}</span>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Transition Modal */}
      <StatusTransitionModal
        show={showStatusModal}
        ticket={ticket}
        onConfirm={handleStatusUpdate}
        onCancel={() => setShowStatusModal(false)}
        isLoading={updatingStatus}
      />

      {/* Assign Engineer Modal */}
      <AssignEngineerModal
        show={showAssignModal}
        ticket={ticket}
        onConfirm={handleAssignEngineer}
        onCancel={() => setShowAssignModal(false)}
        isLoading={assigningEngineer}
      />

      {/* Delete Ticket Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        title="Delete Ticket"
        message="Are you sure you want to permanently delete this ticket? This cannot be undone."
        onConfirm={handleDeleteTicket}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deletingTicket}
      />
    </div>
  );
};
