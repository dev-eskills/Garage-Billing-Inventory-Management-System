import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
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
import AdminExpenses from "../pages/admin/AdminExpenses";
import MechanicDetails from "../pages/admin/MechanicDetails";
import AdminLosses from "../pages/admin/AdminLosses";
import MechanicDashboard from "../pages/mechanic/MechanicDashboard";
import MechanicProfile from "../pages/mechanic/MechanicProfile";
import MechanicWorkOrders from "../pages/mechanic/MechanicWorkOrders";
import MechanicParts from "../pages/mechanic/MechanicParts";
import MechanicInvoices from "../pages/mechanic/MechanicInvoices";
import MechanicInvoiceDetail from "../pages/mechanic/MechanicInvoiceDetail";
import MechanicCustomers from "../pages/mechanic/MechanicCustomers";
import MechanicCustomerDetail from "../pages/mechanic/MechanicCustomerDetail";
import MechanicReports from "../pages/mechanic/MechanicReports";
import MechanicJobDetail from "../pages/mechanic/MechanicJobDetail";
import CompletedJobs from "../components/Mechanic/CompletedJobs";
import PendingJobs from "../components/Mechanic/PendingJobs";
import PartsRequest from "../components/Mechanic/PartsRequest";
import MechanicLayout from "../layouts/mechanic/MechanicLayout";
import CreateCustomer from "../pages/mechanic/CreateCustomer";
import MechanicPurchase from "../pages/mechanic/MechanicPurchase";
import CreateJob from "../pages/mechanic/CreateJob";
import AllAssignedJobs from "../pages/mechanic/AllAssignedJobs";
import MechanicPurchases from "../pages/mechanic/MechanicPurchases";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navigate to="/mechanic" replace />
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
    path: "/mechanic",
    element: (
      <ProtectedRoute requiredRole="mechanic">
        <MechanicLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MechanicDashboard /> },
      { path: "profile", element: <MechanicProfile /> },
      {
        path: "work-orders",
        element: <MechanicWorkOrders />,
      },
      {
        path: "parts",
        element: <MechanicParts />,
      },

      {
        path: "invoices",
        element: <MechanicInvoices />,
      },
      {
        path: "invoices/:id",
        element: <MechanicInvoiceDetail />,
      },
      {
        path: "customers",
        element: <MechanicCustomers />,
      },
      {
        path: "create-customer",
        element: <CreateCustomer />,
      },
      {
        path: "purchase",
        element: <MechanicPurchase />,
      },
      {
        path: "customers/:id",
        element: <MechanicCustomerDetail />,
      },
      {
        path: "reports",
        element: <MechanicReports />,
      },
      {
        path: "all-jobs",
        element: <AllAssignedJobs />,
      },
      {
        path: "jobs/:id",
        element: <MechanicJobDetail />,
      },
      {
        path: "completed-jobs",
        element: <CompletedJobs />,
      },
      {
        path: "pending-jobs",
        element: <PendingJobs />,
      },
      {
        path: "parts-requests",
        element: <PartsRequest />,
      },
      {
        path: "create-job",
        element: <CreateJob />,
      },
      {
        path: "purchase-history",
        element: <MechanicPurchases />,
      },
    ],
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
      { path: "parts", element: <AdminParts /> },
      { path: "mechanics", element: <AdminMechanics /> },
      { path: "mechanics/:id", element: <MechanicDetails /> },
      { path: "vendors", element: <AdminVendors /> },
      { path: "inventory", element: <AdminInventory /> },
      { path: "purchase", element: <AdminPurchase /> },
      { path: "expenses", element: <AdminExpenses /> },
      { path: "losses", element: <AdminLosses /> },
      { path: "customers", element: <AdminCustomers /> },
      { path: "invoices", element: <AdminInvoices /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
]);

export default router;
