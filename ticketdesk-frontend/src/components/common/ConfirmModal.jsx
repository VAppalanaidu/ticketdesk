import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
  show,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static" className="rounded-4">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          {variant === 'danger' && <AlertTriangle className="text-danger" size={22} />}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3 text-slate-600">
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onCancel} disabled={isLoading} className="px-4 py-2 rounded-3">
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 py-2 rounded-3 fw-semibold shadow-sm"
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
