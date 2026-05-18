import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Auth & Protected Routes
import ProtectedRoute from "../Components/ProtectedRoute";

// Auth Pages
const Login = lazy(() => import("../pages/Login"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));

// Layouts
const AdminDashboard = lazy(() => import("../layouts/admin/AdminDashboard"));
const MechanicLayout = lazy(() => import("../layouts/mechanic/MechanicLayout"));

// Admin Pages
const AdminOverview = lazy(() => import("../pages/admin/AdminOverview"));
const AdminMechanics = lazy(() => import("../pages/admin/AdminMechanics"));
const AdminVendors = lazy(() => import("../pages/admin/AdminVendors"));
const AdminInventory = lazy(() => import("../pages/admin/AdminInventory"));
const AdminCustomers = lazy(() => import("../pages/admin/AdminCustomers"));
const AdminInvoices = lazy(() => import("../pages/admin/AdminInvoices"));
const AdminSettings = lazy(() => import("../pages/admin/AdminSettings"));
const AdminParts = lazy(() => import("../pages/admin/AdminParts"));
const AdminPurchase = lazy(() => import("../pages/admin/AdminPurchase"));
const AdminExpenses = lazy(() => import("../pages/admin/AdminExpenses"));
const MechanicDetails = lazy(() => import("../pages/admin/MechanicDetails"));
const AdminLosses = lazy(() => import("../pages/admin/AdminLosses"));
const AdminReminders = lazy(() => import("../pages/admin/AdminReminders"));

// Mechanic Pages
const MechanicDashboard = lazy(() => import("../pages/mechanic/MechanicDashboard"));
const MechanicProfile = lazy(() => import("../pages/mechanic/MechanicProfile"));
const MechanicWorkOrders = lazy(() => import("../pages/mechanic/MechanicWorkOrders"));
const MechanicParts = lazy(() => import("../pages/mechanic/MechanicParts"));
const MechanicInvoices = lazy(() => import("../pages/mechanic/MechanicInvoices"));
const MechanicInvoiceDetail = lazy(() => import("../pages/mechanic/MechanicInvoiceDetail"));
const MechanicCustomers = lazy(() => import("../pages/mechanic/MechanicCustomers"));
const MechanicCustomerDetail = lazy(() => import("../pages/mechanic/MechanicCustomerDetail"));
const MechanicReports = lazy(() => import("../pages/mechanic/MechanicReports"));
const MechanicJobDetail = lazy(() => import("../pages/mechanic/MechanicJobDetail"));
const CreateCustomer = lazy(() => import("../pages/mechanic/CreateCustomer"));
const MechanicPurchase = lazy(() => import("../pages/mechanic/MechanicPurchase"));
const CreateJob = lazy(() => import("../pages/mechanic/CreateJob"));
const AllAssignedJobs = lazy(() => import("../pages/mechanic/AllAssignedJobs"));
const MechanicPurchases = lazy(() => import("../pages/mechanic/MechanicPurchases"));

// Mechanic Components (if used as pages)
const CompletedJobs = lazy(() => import("../Components/Mechanic/CompletedJobs"));
const PendingJobs = lazy(() => import("../Components/Mechanic/pendingJobs"));
const PartsRequest = lazy(() => import("../Components/Mechanic/PartsRequest"));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const LazyComponent = ({ Component }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

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
        <LazyComponent Component={Login} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute onlyGuest={true}>
        <LazyComponent Component={ForgotPassword} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <ProtectedRoute>
        <LazyComponent Component={ResetPassword} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mechanic",
    element: (
      <ProtectedRoute requiredRole="mechanic">
        <LazyComponent Component={MechanicLayout} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LazyComponent Component={MechanicDashboard} /> },
      { path: "profile", element: <LazyComponent Component={MechanicProfile} /> },
      { path: "work-orders", element: <LazyComponent Component={MechanicWorkOrders} /> },
      { path: "parts", element: <LazyComponent Component={MechanicParts} /> },
      { path: "invoices", element: <LazyComponent Component={MechanicInvoices} /> },
      { path: "invoices/:id", element: <LazyComponent Component={MechanicInvoiceDetail} /> },
      { path: "customers", element: <LazyComponent Component={MechanicCustomers} /> },
      { path: "create-customer", element: <LazyComponent Component={CreateCustomer} /> },
      { path: "purchase", element: <LazyComponent Component={MechanicPurchase} /> },
      { path: "customers/:id", element: <LazyComponent Component={MechanicCustomerDetail} /> },
      { path: "reports", element: <LazyComponent Component={MechanicReports} /> },
      { path: "all-jobs", element: <LazyComponent Component={AllAssignedJobs} /> },
      { path: "jobs/:id", element: <LazyComponent Component={MechanicJobDetail} /> },
      { path: "completed-jobs", element: <LazyComponent Component={CompletedJobs} /> },
      { path: "pending-jobs", element: <LazyComponent Component={PendingJobs} /> },
      { path: "parts-requests", element: <LazyComponent Component={PartsRequest} /> },
      { path: "create-job", element: <LazyComponent Component={CreateJob} /> },
      { path: "purchase-history", element: <LazyComponent Component={MechanicPurchases} /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <LazyComponent Component={AdminDashboard} />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <LazyComponent Component={AdminOverview} /> },
      { path: "parts", element: <LazyComponent Component={AdminParts} /> },
      { path: "mechanics", element: <LazyComponent Component={AdminMechanics} /> },
      { path: "mechanics/:id", element: <LazyComponent Component={MechanicDetails} /> },
      { path: "vendors", element: <LazyComponent Component={AdminVendors} /> },
      { path: "inventory", element: <LazyComponent Component={AdminInventory} /> },
      { path: "purchase", element: <LazyComponent Component={AdminPurchase} /> },
      { path: "expenses", element: <LazyComponent Component={AdminExpenses} /> },
      { path: "losses", element: <LazyComponent Component={AdminLosses} /> },
      { path: "customers", element: <LazyComponent Component={AdminCustomers} /> },
      { path: "invoices", element: <LazyComponent Component={AdminInvoices} /> },
      { path: "reminders", element: <LazyComponent Component={AdminReminders} /> },
      { path: "settings", element: <LazyComponent Component={AdminSettings} /> },
    ],
  },
]);

export default router;
