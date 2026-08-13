import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, UserPlus, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  sanitizeIndianPhone,
  validateIndianPhone,
} from '../../utils/validation';

export const AddSupportEngineerPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      department: 'Technical Support',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    const { confirmPassword, ...payload } = data;
    payload.phone = sanitizeIndianPhone(payload.phone);
    payload.role = 'SUPPORT_ENGINEER';

    try {
      await userService.createSupportEngineer(payload);
      toast.success(`Support Engineer ${payload.firstName} ${payload.lastName} created successfully!`);
      reset();
      navigate('/users');
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Failed to create Support Engineer account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneChange = (e) => {
    const sanitized = sanitizeIndianPhone(e.target.value);
    setValue('phone', sanitized, { shouldValidate: touchedFields.phone });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <Link to="/users" className="text-slate-600 text-xs font-semibold text-decoration-none d-inline-flex align-items-center gap-1 mb-2">
          <ArrowLeft size={16} /> Back to User Directory
        </Link>
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
            <UserCheck size={24} />
          </div>
          <div>
            <h4 className="fw-bold text-slate-900 mb-0">Add Support Engineer</h4>
            <p className="text-muted text-sm mb-0">
              Create a support engineer account for managing and resolving employee IT tickets.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4 p-4">
        <Card.Body className="p-2">
          {serverError && (
            <Alert variant="danger" className="text-xs p-3 rounded-3 mb-4">
              {serverError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Personal Info */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Sarah"
                    {...register('firstName', {
                      required: 'First name is required.',
                      minLength: { value: 2, message: 'Must be at least 2 characters.' },
                    })}
                    isInvalid={!!errors.firstName && touchedFields.firstName}
                    className="rounded-3 py-2.5 text-sm"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Jenkins"
                    {...register('lastName', {
                      required: 'Last name is required.',
                      minLength: { value: 2, message: 'Must be at least 2 characters.' },
                    })}
                    isInvalid={!!errors.lastName && touchedFields.lastName}
                    className="rounded-3 py-2.5 text-sm"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {/* Credentials */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    Username <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="sjenkins"
                    {...register('username', {
                      required: 'Username is required.',
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+$/,
                        message: 'Only letters, numbers, dots, hyphens allowed.',
                      },
                    })}
                    isInvalid={!!errors.username && touchedFields.username}
                    className="rounded-3 py-2.5 text-sm"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.username?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="sarah@ticketdesk.com"
                    {...register('email', {
                      required: 'Email is required.',
                      pattern: {
                        value: EMAIL_REGEX,
                        message: 'Please enter a valid email address.',
                      },
                    })}
                    isInvalid={!!errors.email && touchedFields.email}
                    className="rounded-3 py-2.5 text-sm"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {/* Indian Mobile Number & Department */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light text-muted text-xs px-2.5">+91</InputGroup.Text>
                    <Form.Control
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      {...register('phone', {
                        required: 'Phone number is required.',
                        validate: (val) => validateIndianPhone(val, true),
                      })}
                      onChange={handlePhoneChange}
                      isInvalid={!!errors.phone && touchedFields.phone}
                      className="rounded-end-3 py-2.5 text-sm font-monospace"
                    />
                    <Form.Control.Feedback type="invalid" className="text-2xs">
                      {errors.phone?.message}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">Department</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('department')}
                    className="rounded-3 py-2.5 text-sm"
                  />
                </Form.Group>
              </div>
            </div>

            {/* Password Fields */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Min 8 chars (1 upper, 1 lower, 1 digit, 1 special @$!%*?&)"
                    {...register('password', {
                      required: 'Password is required.',
                      minLength: { value: 8, message: 'Must be at least 8 characters.' },
                      pattern: {
                        value: PASSWORD_REGEX,
                        message: 'Requires 1 upper, 1 lower, 1 digit, 1 special char (@$!%*?&)',
                      },
                    })}
                    isInvalid={!!errors.password && touchedFields.password}
                    className="rounded-3 py-2.5 text-sm"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="fw-semibold text-sm">
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter password"
                    {...register('confirmPassword', {
                      required: 'Please confirm password.',
                      validate: (val, formVals) => val === formVals.password || 'Passwords do not match.',
                    })}
                    isInvalid={!!errors.confirmPassword && touchedFields.confirmPassword}
                    className="rounded-3 py-2.5 text-sm"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.confirmPassword?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            {/* Read-Only Role Field */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-sm">System Role</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value="SUPPORT ENGINEER"
                className="bg-light text-slate-800 fw-bold text-sm rounded-3 py-2.5 font-monospace"
              />
              <Form.Text className="text-2xs text-muted">
                Accounts created via this form are assigned full Support Engineer authorization.
              </Form.Text>
            </Form.Group>

            {/* Actions */}
            <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top border-slate-100">
              <Button as={Link} to="/users" variant="light" className="px-4 py-2 rounded-3 text-sm">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="px-5 py-2.5 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
              >
                <UserPlus size={16} /> {submitting ? 'Creating Support Engineer...' : 'Create Support Engineer'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
