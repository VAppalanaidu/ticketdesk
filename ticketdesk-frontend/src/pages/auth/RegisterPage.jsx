import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form, InputGroup, ProgressBar } from 'react-bootstrap';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import {
  EMAIL_REGEX,
  evaluatePasswordStrength,
  PASSWORD_REGEX,
  sanitizeIndianPhone,
  validateIndianPhone,
} from '../../utils/validation';

export const RegisterPage = () => {
  const { register: registerAuth, isLoading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
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
      department: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordVal = watch('password', '');
  const passStrength = evaluatePasswordStrength(passwordVal);

  const onSubmit = async (data) => {
    setServerError('');
    const { confirmPassword, ...payload } = data;
    payload.phone = sanitizeIndianPhone(payload.phone);
    payload.role = 'EMPLOYEE'; // Explicitly set EMPLOYEE role to pass backend DTO @NotNull validation

    try {
      await registerAuth(payload);
      toast.success('Account created successfully! Redirecting to sign in...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Registration failed. Please check form details.';
      if (errMsg.toLowerCase().includes('username')) {
        setServerError('Username is already registered. Please choose another username.');
      } else if (errMsg.toLowerCase().includes('email')) {
        setServerError('An account with this email address already exists.');
      } else {
        setServerError(errMsg);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const sanitized = sanitizeIndianPhone(e.target.value);
    setValue('phone', sanitized, { shouldValidate: touchedFields.phone });
  };

  const inputClass = `text-xs py-2 shadow-none ${
    isDark
      ? 'bg-slate-900 text-white border-slate-700 placeholder-slate-500'
      : 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400'
  }`;

  const labelClass = `fw-semibold text-2xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <Card className={`border rounded-4 p-3 my-3 shadow-lg transition-all ${
      isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-200 shadow-sm'
    }`}>
      <Card.Body className="p-2">
        {/* Form Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-2 border border-primary border-opacity-20 shadow-sm">
            <UserPlus size={28} />
          </div>
          <h4 className={`fw-bold mb-1 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Create Employee Account
          </h4>
          <p className={`text-xs mb-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Fill out your details to join the IT Support Workspace
          </p>
        </div>

        {serverError && (
          <Alert variant="danger" className="text-xs p-2.5 rounded-3 mb-3 border-0 bg-danger bg-opacity-15 text-danger">
            {serverError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Personal Info */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <Form.Group>
                <Form.Label className={labelClass}>
                  First Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Employee"
                  {...register('firstName', {
                    required: 'First name is required.',
                    minLength: { value: 2, message: 'Must be at least 2 characters.' },
                    maxLength: { value: 50, message: 'Cannot exceed 50 characters.' },
                    setValueAs: (v) => v.trim(),
                  })}
                  isInvalid={!!errors.firstName && touchedFields.firstName}
                  className={inputClass}
                />
                <Form.Control.Feedback type="invalid" className="text-2xs">
                  {errors.firstName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group>
                <Form.Label className={labelClass}>
                  Last Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Two"
                  {...register('lastName', {
                    required: 'Last name is required.',
                    minLength: { value: 2, message: 'Must be at least 2 characters.' },
                    maxLength: { value: 50, message: 'Cannot exceed 50 characters.' },
                    setValueAs: (v) => v.trim(),
                  })}
                  isInvalid={!!errors.lastName && touchedFields.lastName}
                  className={inputClass}
                />
                <Form.Control.Feedback type="invalid" className="text-2xs">
                  {errors.lastName?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          {/* Credentials */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <Form.Group>
                <Form.Label className={labelClass}>
                  Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="employee2"
                  {...register('username', {
                    required: 'Username is required.',
                    minLength: { value: 3, message: 'Must be at least 3 characters.' },
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+$/,
                      message: 'Only letters, numbers, dots, hyphens allowed.',
                    },
                    setValueAs: (v) => v.trim(),
                  })}
                  isInvalid={!!errors.username && touchedFields.username}
                  className={inputClass}
                />
                <Form.Control.Feedback type="invalid" className="text-2xs">
                  {errors.username?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group>
                <Form.Label className={labelClass}>
                  Email Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="employee2@gmail.com"
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Please enter a valid email address.',
                    },
                    setValueAs: (v) => v.trim(),
                  })}
                  isInvalid={!!errors.email && touchedFields.email}
                  className={inputClass}
                />
                <Form.Control.Feedback type="invalid" className="text-2xs">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          {/* Phone & Department */}
          <div className="row g-2 mb-2">
            <div className="col-6">
              <Form.Group>
                <Form.Label className={labelClass}>
                  Phone Number <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className={`text-xs px-2 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'}`}>
                    +91
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder="9856987458"
                    maxLength={10}
                    {...register('phone', {
                      required: 'Phone number is required.',
                      validate: (val) => validateIndianPhone(val, true),
                    })}
                    onChange={handlePhoneChange}
                    isInvalid={!!errors.phone && touchedFields.phone}
                    className={`${inputClass} font-monospace`}
                  />
                  <Form.Control.Feedback type="invalid" className="text-2xs">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </div>

            <div className="col-6">
              <Form.Group>
                <Form.Label className={labelClass}>Department</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="IT, Finance, HR..."
                  {...register('department')}
                  className={inputClass}
                />
              </Form.Group>
            </div>
          </div>

          {/* Password */}
          <Form.Group className="mb-2">
            <Form.Label className={labelClass}>
              Password <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 chars (1 upper, 1 lower, 1 digit, 1 special @$!%*?&)"
                {...register('password', {
                  required: 'Password is required.',
                  minLength: { value: 8, message: 'Password must be at least 8 characters.' },
                  maxLength: { value: 64, message: 'Password cannot exceed 64 characters.' },
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: 'Requires 1 uppercase, 1 lowercase, 1 digit, and 1 special char (@$!%*?&)',
                  },
                })}
                isInvalid={!!errors.password && touchedFields.password}
                className={inputClass}
              />
              <Button
                variant={isDark ? 'outline-secondary' : 'light'}
                className={isDark ? 'border-slate-700 text-slate-400 bg-slate-900' : 'border-slate-300 text-slate-600 bg-slate-100'}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
              <Form.Control.Feedback type="invalid" className="text-2xs">
                {errors.password?.message}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Password Strength Bar */}
            {passwordVal && (
              <div className="mt-1.5">
                <div className="d-flex justify-content-between align-items-center text-2xs mb-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Password Strength:</span>
                  <span className={`fw-bold text-${passStrength.variant}`}>{passStrength.label}</span>
                </div>
                <ProgressBar
                  now={passStrength.percent}
                  variant={passStrength.variant}
                  style={{ height: '4px' }}
                  className={isDark ? 'bg-slate-900' : 'bg-slate-200'}
                />
              </div>
            )}
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group className="mb-3">
            <Form.Label className={labelClass}>
              Confirm Password <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter password"
              {...register('confirmPassword', {
                required: 'Please confirm your password.',
                validate: (val) => val === passwordVal || 'Passwords do not match.',
              })}
              isInvalid={!!errors.confirmPassword && touchedFields.confirmPassword}
              className={inputClass}
            />
            <Form.Control.Feedback type="invalid" className="text-2xs">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-100 py-2.5 rounded-3 fw-bold shadow-sm mt-2 text-sm d-flex align-items-center justify-content-center gap-2"
          >
            <UserPlus size={18} /> {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </Form>

        <div className={`mt-3 text-center border-top pt-2 text-xs ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none hover-underline">
            Sign In
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
