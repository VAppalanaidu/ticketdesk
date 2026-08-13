import React, { useEffect } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  sanitizeIndianPhone,
  validateIndianPhone,
} from '../../utils/validation';

export const UserFormModal = ({ show, user, onSave, onCancel, isLoading }) => {
  const isEditing = !!user;

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
      password: '',
      phone: '',
      department: '',
      role: 'SUPPORT_ENGINEER',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        department: user.department || '',
        role: user.role || 'SUPPORT_ENGINEER',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        role: 'SUPPORT_ENGINEER',
      });
    }
  }, [user, reset]);

  const onSubmitForm = (data) => {
    if (data.phone) {
      data.phone = sanitizeIndianPhone(data.phone);
    }
    // Force role to SUPPORT_ENGINEER on creation
    if (!isEditing) {
      data.role = 'SUPPORT_ENGINEER';
    }
    onSave(data);
  };

  const handlePhoneChange = (e) => {
    const sanitized = sanitizeIndianPhone(e.target.value);
    setValue('phone', sanitized, { shouldValidate: touchedFields.phone });
  };

  return (
    <Modal show={show} onHide={onCancel} centered backdrop="static" className="rounded-4">
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold">
          {isEditing ? 'Edit User Profile' : 'Add Support Engineer'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmitForm)} noValidate>
        <Modal.Body className="py-2">
          <div className="row g-3">
            <div className="col-6">
              <Form.Group>
                <Form.Label className="fw-semibold text-sm">
                  First Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Sarah"
                  {...register('firstName', {
                    required: 'First name is required.',
                    minLength: { value: 2, message: 'At least 2 characters.' },
                  })}
                  isInvalid={!!errors.firstName && touchedFields.firstName}
                  className="rounded-3 py-2 text-sm"
                />
                <Form.Control.Feedback type="invalid" className="text-2xs">
                  {errors.firstName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group>
                <Form.Label className="fw-semibold text-sm">
                  Last Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Jenkins"
                  {...register('lastName', {
                    required: 'Last name is required.',
                    minLength: { value: 2, message: 'At least 2 characters.' },
                  })}
                  isInvalid={!!errors.lastName && touchedFields.lastName}
                  className="rounded-3 py-2 text-sm"
                />
                <Form.Control.Feedback type="invalid" className="text-2xs">
                  {errors.lastName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            {!isEditing && (
              <>
                <div className="col-6">
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
                          message: 'Letters, numbers, dots, hyphens only.',
                        },
                      })}
                      isInvalid={!!errors.username && touchedFields.username}
                      className="rounded-3 py-2 text-sm"
                    />
                    <Form.Control.Feedback type="invalid" className="text-2xs">
                      {errors.username?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <div className="col-6">
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
                      className="rounded-3 py-2 text-sm"
                    />
                    <Form.Control.Feedback type="invalid" className="text-2xs">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-12">
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
                          message: 'Requires 1 upper, 1 lower, 1 digit, 1 special (@$!%*?&)',
                        },
                      })}
                      isInvalid={!!errors.password && touchedFields.password}
                      className="rounded-3 py-2 text-sm"
                    />
                    <Form.Control.Feedback type="invalid" className="text-2xs">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </>
            )}

            {/* Indian Mobile Number with +91 prefix */}
            <div className="col-6">
              <Form.Group>
                <Form.Label className="fw-semibold text-sm">
                  Phone Number <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light text-muted text-xs px-2">+91</InputGroup.Text>
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
                    className="rounded-end-3 py-2 text-sm font-monospace"
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-6">
              <Form.Group>
                <Form.Label className="fw-semibold text-sm">Department</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Technical Support"
                  {...register('department')}
                  className="rounded-3 py-2 text-sm"
                />
              </Form.Group>
            </div>

            {/* Role Fixed to Support Engineer */}
            <div className="col-12">
              <Form.Group>
                <Form.Label className="fw-semibold text-sm">System Role</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value="SUPPORT ENGINEER"
                  className="bg-light text-slate-700 fw-bold text-sm rounded-3 py-2 font-monospace"
                />
                <Form.Text className="text-2xs text-muted">
                  New users created by Admin are assigned the Support Engineer role.
                </Form.Text>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-3">
          <Button variant="light" onClick={onCancel} disabled={isLoading} className="rounded-3 px-4">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading} className="rounded-3 px-4 fw-semibold shadow-sm">
            {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Add Support Engineer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
