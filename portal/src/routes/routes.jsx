import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import MechanicDashboard from "../layouts/mechanic/MechanicDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../layouts/admin/AdminDashboard";
import AdminOverview from "../pages/admin/AdminOverview";
import AdminMechanics from "../pages/admin/AdminMechanics";
import AdminVendors from "../pages/admin/AdminVendors";
import AdminInventory from "../pages/admin/AdminInventory";
import AdminCustomers from "../pages/admin/AdminCustomers";
import AdminInvoices from "../pages/admin/AdminInvoices";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminParts from "../pages/admin/AdminParts";
import AdminPurchase from "../pages/admin/AdminPurchase";

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
        children: [
            { index: true, element: <Navigate to="overview" replace /> },
            { path: "overview", element: <AdminOverview /> },
            { path: "parts", element:<AdminParts/> },
            { path: "mechanics", element: <AdminMechanics /> },
            { path: "vendors", element: <AdminVendors /> },
            { path: "inventory", element: <AdminInventory /> },
            { path: "purchase", element: <AdminPurchase /> },
            { path: "customers", element: <AdminCustomers /> },
            { path: "invoices", element: <AdminInvoices /> },
            { path: "settings", element: <AdminSettings /> },
        ]
    },
])

export default router;