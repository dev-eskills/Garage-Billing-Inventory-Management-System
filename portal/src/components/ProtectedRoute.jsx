import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole, onlyGuest = false }) {
  const { userPending, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Get user role from metadata
  const userRole = user?.user_metadata?.role;

  useEffect(() => {
    if (!userPending) {
      if (!isAuthenticated && !onlyGuest) {
        navigate('/login', { replace: true });
      }
      if (isAuthenticated && onlyGuest) {
        // Redirect to their respective dashboard if they try to access login/signup while logged in
        const target = userRole === 'admin' ? '/admin' : '/mechanic';
        navigate(target, { replace: true });
      }
    }
  }, [userPending, isAuthenticated, onlyGuest, navigate, userRole]);

  if (userPending) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#2b5ae3]" />
      </div>
    );
  }

  // If we are checking for a guest and they are authenticated, return null while useEffect navigates
  if (onlyGuest && isAuthenticated) return null;
  // If we are checking for auth and they aren't, return null
  if (!onlyGuest && !isAuthenticated) return null;

  // Role checking logic (only for protected routes)
  if (!onlyGuest && requiredRole && userRole !== requiredRole) {
    if (userRole === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/mechanic" />;
  }

  return children;
}
