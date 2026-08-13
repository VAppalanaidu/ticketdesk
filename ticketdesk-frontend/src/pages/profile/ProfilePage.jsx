import React, { useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Nav, Row, Tab } from 'react-bootstrap';
import { Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/formatters';
import {
  PASSWORD_REGEX,
  sanitizeIndianPhone,
  validateIndianPhone,
} from '../../utils/validation';
import { RoleBadge } from '../../components/common/RoleBadge';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile Form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors, touchedFields: profileTouched },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      department: user?.department || '',
    },
  });

  // Password Form
  const {
    register: regPass,
    handleSubmit: handlePassSubmit,
    reset: resetPassForm,
    watch: watchPass,
    formState: { errors: passErrors, touchedFields: passTouched },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordVal = watchPass('newPassword', '');

  const onUpdateProfile = async (data) => {
    setUpdatingProfile(true);
    if (data.phone) {
      data.phone = sanitizeIndianPhone(data.phone);
    }
    try {
      const updated = await userService.updateUser(user.id, data);
      setUser(updated);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePhoneChange = (e) => {
    const sanitized = sanitizeIndianPhone(e.target.value);
    setProfileValue('phone', sanitized, { shouldValidate: profileTouched.phone });
  };

  const onChangePassword = async (data) => {
    setChangingPassword(true);
    try {
      await authService.changePassword(data);
      toast.success('Password changed successfully');
      resetPassForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h4 className="fw-bold text-slate-900 mb-1">User Account & Security</h4>
        <p className="text-muted text-sm mb-0">Manage your profile details and authentication credentials.</p>
      </div>

      <Row className="g-4">
        {/* User Card */}
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm rounded-4 p-4 text-center">
            <Card.Body className="p-0">
              <div
                className="avatar bg-primary text-white rounded-circle fw-bold fs-2 d-inline-flex align-items-center justify-content-center mb-3 shadow-md"
                style={{ width: 80, height: 80 }}
              >
                {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
              <h5 className="fw-bold text-slate-900 mb-1">{user.fullName}</h5>
              <p className="text-muted text-xs font-monospace mb-2">{user.username}</p>
              <div className="mb-3">
                <RoleBadge role={user.role} />
              </div>

              <div className="text-start border-top border-slate-100 pt-3 text-xs text-slate-600 d-flex flex-column gap-2">
                <div>
                  <strong className="text-slate-800">Email:</strong> {user.email}
                </div>
                <div>
                  <strong className="text-slate-800">Phone:</strong> {user.phone ? `+91 ${user.phone}` : 'N/A'}
                </div>
                <div>
                  <strong className="text-slate-800">Department:</strong> {user.department || 'N/A'}
                </div>
                <div>
                  <strong className="text-slate-800">Account Created:</strong> {formatDate(user.createdAt)}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Tabbed Settings Form */}
        <Col xs={12} md={8}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <Card.Body className="p-0">
              <Tab.Container defaultActiveKey="profile">
                <Nav variant="pills" className="mb-4 bg-light p-1 rounded-3">
                  <Nav.Item className="flex-grow-1 text-center">
                    <Nav.Link eventKey="profile" className="rounded-3 fw-semibold text-sm py-2">
                      <User size={16} className="me-1.5" /> Personal Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="flex-grow-1 text-center">
                    <Nav.Link eventKey="security" className="rounded-3 fw-semibold text-sm py-2">
                      <Lock size={16} className="me-1.5" /> Change Password
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  {/* Profile Tab */}
                  <Tab.Pane eventKey="profile">
                    <Form onSubmit={handleProfileSubmit(onUpdateProfile)} noValidate>
                      <Row className="g-3 mb-3">
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold text-sm">
                              First Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              {...regProfile('firstName', { required: 'First name is required.' })}
                              isInvalid={!!profileErrors.firstName && profileTouched.firstName}
                              className="rounded-3 py-2 text-sm"
                            />
                            <Form.Control.Feedback type="invalid" className="text-2xs">
                              {profileErrors.firstName?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold text-sm">
                              Last Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              {...regProfile('lastName', { required: 'Last name is required.' })}
                              isInvalid={!!profileErrors.lastName && profileTouched.lastName}
                              className="rounded-3 py-2 text-sm"
                            />
                            <Form.Control.Feedback type="invalid" className="text-2xs">
                              {profileErrors.lastName?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="g-3 mb-4">
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold text-sm">Phone Number</Form.Label>
                            <InputGroup hasValidation>
                              <InputGroup.Text className="bg-light text-muted text-xs px-2">+91</InputGroup.Text>
                              <Form.Control
                                type="tel"
                                placeholder="9876543210"
                                maxLength={10}
                                {...regProfile('phone', {
                                  validate: (val) => validateIndianPhone(val, false),
                                })}
                                onChange={handlePhoneChange}
                                isInvalid={!!profileErrors.phone && profileTouched.phone}
                                className="rounded-end-3 py-2 text-sm font-monospace"
                              />
                              <Form.Control.Feedback type="invalid" className="text-2xs">
                                {profileErrors.phone?.message}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold text-sm">Department</Form.Label>
                            <Form.Control type="text" {...regProfile('department')} className="rounded-3 py-2 text-sm" />
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={updatingProfile}
                          className="rounded-3 px-4 py-2 fw-semibold shadow-sm"
                        >
                          {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>

                  {/* Security Tab */}
                  <Tab.Pane eventKey="security">
                    <Form onSubmit={handlePassSubmit(onChangePassword)} noValidate>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-sm">
                          Current Password <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="password"
                          {...regPass('currentPassword', { required: 'Current password is required.' })}
                          isInvalid={!!passErrors.currentPassword && passTouched.currentPassword}
                          className="rounded-3 py-2 text-sm"
                        />
                        <Form.Control.Feedback type="invalid" className="text-2xs">
                          {passErrors.currentPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-sm">
                          New Password <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="password"
                          {...regPass('newPassword', {
                            required: 'New password is required.',
                            minLength: { value: 8, message: 'Must be at least 8 characters.' },
                            pattern: {
                              value: PASSWORD_REGEX,
                              message: 'Requires 1 upper, 1 lower, 1 digit, and 1 special char (@$!%*?&)',
                            },
                          })}
                          isInvalid={!!passErrors.newPassword && passTouched.newPassword}
                          className="rounded-3 py-2 text-sm"
                        />
                        <Form.Control.Feedback type="invalid" className="text-2xs">
                          {passErrors.newPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-sm">
                          Confirm New Password <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="password"
                          {...regPass('confirmPassword', {
                            required: 'Please confirm password.',
                            validate: (val) => val === newPasswordVal || 'Passwords do not match.',
                          })}
                          isInvalid={!!passErrors.confirmPassword && passTouched.confirmPassword}
                          className="rounded-3 py-2 text-sm"
                        />
                        <Form.Control.Feedback type="invalid" className="text-2xs">
                          {passErrors.confirmPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <div className="d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={changingPassword}
                          className="rounded-3 px-4 py-2 fw-semibold shadow-sm"
                        >
                          {changingPassword ? 'Updating Password...' : 'Update Password'}
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
