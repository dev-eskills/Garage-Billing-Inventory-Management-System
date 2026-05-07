import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import MechanicDashboard from "../layouts/mechanic/MechanicDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../layouts/admin/AdminDashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Navigate to="/dashboard" replace />
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <ProtectedRoute onlyGuest={true}>
                <Login />
            </ProtectedRoute>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <ProtectedRoute onlyGuest={true}>
                <ForgotPassword />
            </ProtectedRoute>
        ),
    },
    {
        path: "/reset-password",
        element: (
            <ProtectedRoute>
                <ResetPassword />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute requiredRole="mechanic">
                <MechanicDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
            </ProtectedRoute>
        ),
    },
])

export default router;