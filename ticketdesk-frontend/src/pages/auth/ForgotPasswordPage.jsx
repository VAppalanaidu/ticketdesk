import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { ArrowLeft, KeyRound, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandlers';

export const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data);
      setSubmitted(true);
      toast.success('Reset instructions sent to your email');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to process request'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-2xl rounded-4 bg-slate-950 text-white border border-slate-800 p-4">
      <Card.Body className="p-2">
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 bg-primary bg-opacity-10 text-primary rounded-circle mb-2">
            <KeyRound size={28} />
          </div>
          <h4 className="fw-bold text-white mb-1">Forgot Password</h4>
          <p className="text-slate-400 text-xs">Enter your email to receive password reset instructions</p>
        </div>

        {submitted ? (
          <div className="text-center py-3">
            <Alert variant="success" className="text-xs p-3 rounded-3 mb-4">
              If an account with that email exists, password reset instructions have been sent!
            </Alert>
            <Button as={Link} to="/login" variant="primary" className="w-100 py-2 rounded-3 fw-bold">
              Return to Login
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-xs text-slate-300">Registered Email *</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-slate-900 border-slate-700 text-slate-400">
                  <Mail size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder="name@company.com"
                  {...register('email', { required: 'Email address is required' })}
                  isInvalid={!!errors.email}
                  className="bg-slate-900 text-white border-slate-700 text-sm shadow-none"
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-100 py-2.5 rounded-3 fw-bold shadow-lg mb-3"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </Button>
          </Form>
        )}

        <div className="text-center border-top border-slate-800 pt-3">
          <Link to="/login" className="text-slate-400 text-xs text-decoration-none d-inline-flex align-items-center gap-1">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
