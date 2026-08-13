import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Badge, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff, Headphones, Key, Lock, LogIn, Mail, Shield, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';
  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Invalid username/email or password');
    }
  };

  const handleFillDemo = (username, password) => {
    setValue('usernameOrEmail', username, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setServerError('');
  };

  return (
    <Card className="border-0 shadow-2xl rounded-4 bg-slate-950 text-white border border-slate-800 p-4">
      <Card.Body className="p-2">
        {/* Form Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-3 border border-primary border-opacity-20 shadow-sm">
            <Headphones size={32} />
          </div>
          <h4 className="fw-bold text-white mb-1 tracking-tight">Sign In to TicketDesk</h4>
          <p className="text-slate-400 text-xs mb-0">Enter your credentials to access your support workspace</p>
        </div>

        {sessionExpired && (
          <Alert variant="warning" className="text-xs p-2.5 rounded-3 mb-3 border-0 bg-warning bg-opacity-20 text-warning">
            Your session has expired. Please sign in again.
          </Alert>
        )}

        {serverError && (
          <Alert variant="danger" className="text-xs p-2.5 rounded-3 mb-3 border-0 bg-danger bg-opacity-20 text-danger">
            {serverError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username / Email Field */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-xs text-slate-300 d-flex justify-content-between">
              <span>Username or Email <span className="text-danger">*</span></span>
            </Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-slate-900 border-slate-700 text-slate-400">
                <User size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="e.g. admin or john.doe@company.com"
                {...register('usernameOrEmail', {
                  required: 'Username or email is required.',
                  minLength: { value: 3, message: 'Must be at least 3 characters.' },
                })}
                isInvalid={!!errors.usernameOrEmail && touchedFields.usernameOrEmail}
                className="bg-slate-900 text-white border-slate-700 placeholder-slate-500 shadow-none text-sm"
              />
              <Form.Control.Feedback type="invalid" className="text-2xs mt-1">
                {errors.usernameOrEmail?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Password Field */}
          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <Form.Label className="fw-semibold text-xs text-slate-300 mb-0">
                Password <span className="text-danger">*</span>
              </Form.Label>
              <Link to="/forgot-password" className="text-2xs text-primary text-decoration-none hover-underline">
                Forgot password?
              </Link>
            </div>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-slate-900 border-slate-700 text-slate-400">
                <Lock size={18} />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                {...register('password', {
                  required: 'Password is required.',
                })}
                isInvalid={!!errors.password && touchedFields.password}
                className="bg-slate-900 text-white border-slate-700 placeholder-slate-500 shadow-none text-sm"
              />
              <Button
                variant="outline-secondary"
                className="border-slate-700 text-slate-400 bg-slate-900"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
              <Form.Control.Feedback type="invalid" className="text-2xs mt-1">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-100 py-2.5 rounded-3 fw-bold shadow-lg mt-3 d-flex align-items-center justify-content-center gap-2"
          >
            <LogIn size={18} /> {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        {/* Demo Credentials Section */}
        <div className="mt-4 pt-3 border-top border-slate-800">
          <span className="text-2xs text-slate-400 font-monospace text-uppercase fw-semibold d-block text-center mb-2">
            Demo Accounts (Click to Auto-fill)
          </span>
          <div className="d-flex flex-wrap justify-content-center gap-1.5">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleFillDemo('admin', 'TicketDesk@123')}
              className="px-2.5 py-1 text-2xs rounded-pill"
            >
              Admin
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleFillDemo('support', 'TicketDesk@123')}
              className="px-2.5 py-1 text-2xs rounded-pill"
            >
              Support Engineer
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleFillDemo('employee', 'TicketDesk@123')}
              className="px-2.5 py-1 text-2xs rounded-pill"
            >
              Employee
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-2 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary fw-semibold text-decoration-none hover-underline">
            Create an account
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
