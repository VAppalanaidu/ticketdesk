import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { userService } from '../../services/userService';

export const AssignEngineerModal = ({ show, ticket, onConfirm, onCancel, isLoading }) => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [loadingEngineers, setLoadingEngineers] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchEngineers = async () => {
        setLoadingEngineers(true);
        try {
          const list = await userService.getSupportEngineers();
          setEngineers(list || []);
          if (ticket?.assignedTo) {
            setSelectedEngineerId(String(ticket.assignedTo.id));
          } else {
            setSelectedEngineerId('');
          }
        } catch (err) {
          console.error('Failed to load support engineers', err);
        } finally {
          setLoadingEngineers(false);
        }
      };
      fetchEngineers();
    }
  }, [show, ticket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEngineerId) {
      onConfirm(Number(selectedEngineerId));
    }
  };

  if (!ticket) return null;

  return (
    <Modal show={show} onHide={onCancel} centered className="rounded-4">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">Assign Ticket to Support Engineer</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-2">
          <div className="mb-3">
            <span className="text-muted text-xs font-monospace d-block mb-1">Ticket #{ticket.ticketNumber}</span>
            <h6 className="fw-bold text-slate-900">{ticket.title}</h6>
          </div>

          {loadingEngineers ? (
            <div className="text-center py-4 text-muted text-sm">Loading active support engineers...</div>
          ) : engineers.length === 0 ? (
            <div className="alert alert-warning text-xs p-3 rounded-3 mb-0">
              No Support Engineers available in system. Please add a Support Engineer before assigning this ticket.
            </div>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-sm">Select Support Engineer</Form.Label>
              <Form.Select
                value={selectedEngineerId}
                onChange={(e) => setSelectedEngineerId(e.target.value)}
                required
                className="rounded-3 py-2 text-sm"
              >
                <option value="">-- Choose Support Engineer --</option>
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.fullName} ({eng.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onCancel} disabled={isLoading} className="rounded-3 px-4">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedEngineerId || isLoading || engineers.length === 0}
            className="rounded-3 px-4 fw-semibold shadow-sm"
          >
            {isLoading ? 'Assigning...' : 'Assign Engineer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
