import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { KeyRound, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandlers';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      token: tokenFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordVal = watch('newPassword', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.resetPassword(data);
      toast.success('Password reset successfully! Please sign in with your new password.');
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to reset password'));
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
          <h4 className="fw-bold text-white mb-1">Reset Password</h4>
          <p className="text-slate-400 text-xs">Enter your reset token and new password</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-xs text-slate-300">Reset Token *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Paste token received via email"
              {...register('token', { required: 'Reset token is required' })}
              isInvalid={!!errors.token}
              className="bg-slate-900 text-white border-slate-700 font-monospace text-sm shadow-none"
            />
            <Form.Control.Feedback type="invalid">{errors.token?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-xs text-slate-300">New Password *</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-slate-900 border-slate-700 text-slate-400">
                <Lock size={18} />
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Upper, lower, digit, special char"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Must be at least 8 characters' },
                })}
                isInvalid={!!errors.newPassword}
                className="bg-slate-900 text-white border-slate-700 text-sm shadow-none"
              />
              <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold text-xs text-slate-300">Confirm New Password *</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter new password"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (val) => val === newPasswordVal || 'Passwords do not match',
              })}
              isInvalid={!!errors.confirmPassword}
              className="bg-slate-900 text-white border-slate-700 text-sm shadow-none"
            />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-100 py-2.5 rounded-3 fw-bold shadow-lg mb-3"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Form>

        <div className="text-center border-top border-slate-800 pt-3">
          <Link to="/login" className="text-slate-400 text-xs text-decoration-none">
            Back to Login
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
