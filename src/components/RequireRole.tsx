import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../types/auth';

type RequireRoleProps = {role: Role;children: React.ReactNode;};

export function RequireRole({ role, children }: RequireRoleProps) {
  const { session, basePath } = useAuth();
  if (!session) return <Navigate to="/#login" replace />;
  if (session.role !== role) return <Navigate to={basePath} replace />;
  return <>{children}</>;
}