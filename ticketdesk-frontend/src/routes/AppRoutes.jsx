import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicRoute } from '../components/auth/PublicRoute';
import { RoleBasedRoute } from '../components/auth/RoleBasedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { MainLayout } from '../components/layout/MainLayout';

import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { AccessDeniedPage } from '../pages/errors/AccessDeniedPage';
import { NotFoundPage } from '../pages/errors/NotFoundPage';
import { ServerErrorPage } from '../pages/errors/ServerErrorPage';
import { LandingPage } from '../pages/landing/LandingPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { TicketCreatePage } from '../pages/tickets/TicketCreatePage';
import { TicketDetailPage } from '../pages/tickets/TicketDetailPage';
import { TicketListPage } from '../pages/tickets/TicketListPage';
import { AddSupportEngineerPage } from '../pages/users/AddSupportEngineerPage';
import { UserManagementPage } from '../pages/users/UserManagementPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Public Routes */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Authenticated Dashboard & Workspace Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/create" element={<TicketCreatePage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* User Directory: Admin Only */}
        <Route
          path="/users"
          element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <UserManagementPage />
            </RoleBasedRoute>
          }
        />

        {/* Admin Only Support Engineer Creation Route */}
        <Route
          path="/users/add-support-engineer"
          element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AddSupportEngineerPage />
            </RoleBasedRoute>
          }
        />
      </Route>

      {/* Error Fallbacks */}
      <Route path="/403" element={<AccessDeniedPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
