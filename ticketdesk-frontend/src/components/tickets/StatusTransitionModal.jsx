import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { TICKET_STATUS_CONFIG } from '../../constants/ticketConstants';
import { StatusBadge } from '../common/StatusBadge';

export const StatusTransitionModal = ({ show, ticket, onConfirm, onCancel, isLoading }) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  if (!ticket) return null;

  const currentConfig = TICKET_STATUS_CONFIG[ticket.status] || { allowedTransitions: [] };
  const allowedNext = currentConfig.allowedTransitions;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStatus) {
      onConfirm(selectedStatus);
    }
  };

  return (
    <Modal show={show} onHide={onCancel} centered className="rounded-4">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Update Ticket Status</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-2">
          <div className="mb-3">
            <span className="text-muted text-xs font-monospace d-block mb-1">Ticket #{ticket.ticketNumber}</span>
            <h6 className="fw-bold text-slate-900">{ticket.title}</h6>
          </div>

          <div className="p-3 bg-light rounded-3 mb-4 d-flex align-items-center justify-content-between">
            <span className="text-slate-600 text-sm">Current Status:</span>
            <StatusBadge status={ticket.status} />
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-sm">Select New Status</Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
              className="rounded-3 py-2 text-sm"
            >
              <option value="">-- Select Status --</option>
              {allowedNext.map((st) => (
                <option key={st} value={st}>
                  Transition to: {TICKET_STATUS_CONFIG[st]?.label || st}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted text-2xs mt-1">
              Note: Status transitions follow strict lifecycle workflow constraints enforced by the backend.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onCancel} disabled={isLoading} className="rounded-3 px-4">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedStatus || isLoading}
            className="rounded-3 px-4 fw-semibold shadow-sm"
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
