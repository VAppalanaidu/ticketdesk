import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { ArrowLeft, PlusCircle, Send, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TICKET_CATEGORY_CONFIG, TICKET_PRIORITY_CONFIG } from '../../constants/ticketConstants';
import { attachmentService } from '../../services/attachmentService';
import { ticketService } from '../../services/ticketService';
import { getErrorMessage } from '../../utils/errorHandlers';
import { AttachmentUploader } from '../../components/attachments/AttachmentUploader';

export const TicketCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'MEDIUM',
    },
  });

  const titleVal = watch('title', '');
  const descVal = watch('description', '');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // 1. Create Ticket
      const ticketResponse = await ticketService.createTicket({
        ...data,
        title: data.title.trim(),
        description: data.description.trim(),
      });
      toast.success(`Ticket #${ticketResponse.ticketNumber} created successfully!`);

      // 2. Upload Attachment if selected
      if (selectedFile && ticketResponse?.id) {
        try {
          await attachmentService.uploadAttachment(ticketResponse.id, selectedFile);
          toast.success('Attachment uploaded successfully');
        } catch (attachErr) {
          toast.error('Ticket created, but attachment upload failed.');
        }
      }

      navigate(`/tickets/${ticketResponse.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create support ticket'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Navigation Header */}
      <div className="mb-4">
        <Link to="/tickets" className="text-slate-600 text-xs font-semibold text-decoration-none d-inline-flex align-items-center gap-1 mb-2">
          <ArrowLeft size={16} /> Back to Tickets
        </Link>
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
            <PlusCircle size={24} />
          </div>
          <div>
            <h4 className="fw-bold text-slate-900 mb-0">Create Support Request</h4>
            <p className="text-muted text-sm mb-0">Describe your issue in detail and our support team will assist you.</p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4 p-4">
        <Card.Body className="p-2">
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Title with Character Counter */}
            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="fw-semibold text-sm text-slate-800 mb-0">
                  Ticket Title <span className="text-danger">*</span>
                </Form.Label>
                <span className="text-2xs font-monospace text-slate-400">
                  {titleVal.length} / 200
                </span>
              </div>
              <Form.Control
                type="text"
                placeholder="e.g., Unable to connect to VPN after password reset"
                {...register('title', {
                  required: 'Ticket title is required.',
                  minLength: { value: 5, message: 'Title must be at least 5 characters.' },
                  maxLength: { value: 200, message: 'Title cannot exceed 200 characters.' },
                  validate: (val) => val.trim().length >= 5 || 'Title must contain at least 5 non-whitespace characters.',
                })}
                isInvalid={!!errors.title && touchedFields.title}
                className="rounded-3 py-2.5 text-sm"
              />
              <Form.Control.Feedback type="invalid" className="text-2xs">
                {errors.title?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Row className="g-3 mb-4">
              {/* Mandatory Category Selector */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm text-slate-800">
                    Support Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...register('category', { required: 'Please select a support category.' })}
                    isInvalid={!!errors.category && touchedFields.category}
                    className="rounded-3 py-2.5 text-sm"
                  >
                    <option value="">-- Select Category --</option>
                    {Object.keys(TICKET_CATEGORY_CONFIG).map((cat) => (
                      <option key={cat} value={cat}>
                        {TICKET_CATEGORY_CONFIG[cat].label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.category?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Priority Selector */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm text-slate-800">
                    Urgency & Priority <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...register('priority', { required: 'Please select a priority level.' })}
                    isInvalid={!!errors.priority && touchedFields.priority}
                    className="rounded-3 py-2.5 text-sm"
                  >
                    {Object.keys(TICKET_PRIORITY_CONFIG).map((pr) => (
                      <option key={pr} value={pr}>
                        {TICKET_PRIORITY_CONFIG[pr].label} Priority
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.priority?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {/* Description with Character Counter */}
            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="fw-semibold text-sm text-slate-800 mb-0">
                  Detailed Description <span className="text-danger">*</span>
                </Form.Label>
                <span className="text-2xs font-monospace text-slate-400">
                  {descVal.length} chars
                </span>
              </div>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Provide exact steps to reproduce, error messages, system specs, or relevant context..."
                {...register('description', {
                  required: 'Description is required.',
                  minLength: { value: 10, message: 'Description must be at least 10 characters.' },
                  validate: (val) => val.trim().length >= 10 || 'Description cannot be empty or whitespace only.',
                })}
                isInvalid={!!errors.description && touchedFields.description}
                className="rounded-3 p-3 text-sm"
              />
              <Form.Control.Feedback type="invalid" className="text-2xs">
                {errors.description?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* File Attachment Drag & Drop Upload Zone */}
            <div className="mb-4">
              <Form.Label className="fw-semibold text-sm text-slate-800 mb-2">
                Screenshot or Document Attachment (Optional — Max 1 File, 10MB)
              </Form.Label>
              <AttachmentUploader
                selectedFile={selectedFile}
                onFileSelect={(file) => setSelectedFile(file)}
                onFileRemove={() => setSelectedFile(null)}
              />
            </div>

            {/* Submit Actions */}
            <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top border-slate-100">
              <Button as={Link} to="/tickets" variant="light" className="px-4 py-2 rounded-3 text-sm">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="px-5 py-2.5 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
              >
                <Send size={16} /> {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
