import React, { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";

const MechanicDashboard = lazy(
  () => import("../pages/mechanic/MechanicDashboard"),
);
const MechanicProfile = lazy(() => import("../pages/mechanic/MechanicProfile"));
const MechanicWorkOrders = lazy(
  () => import("../pages/mechanic/MechanicWorkOrders"),
);
const MechanicParts = lazy(() => import("../pages/mechanic/MechanicParts"));

const MechanicInvoices = lazy(
  () => import("../pages/mechanic/MechanicInvoices"),
);
const MechanicInvoiceDetail = lazy(
  () => import("../pages/mechanic/MechanicInvoiceDetail"),
);
const MechanicCustomers = lazy(
  () => import("../pages/mechanic/MechanicCustomers"),
);
const MechanicCustomerDetail = lazy(
  () => import("../pages/mechanic/MechanicCustomerDetail"),
);
const MechanicReports = lazy(() => import("../pages/mechanic/MechanicReports"));

const MechanicJobDetail = lazy(
  () => import("../pages/mechanic/MechanicJobDetail"),
);
const ALL_JOBS = lazy(() => import("../pages/mechanic/AllAssignedJobs"));
const CompletedJobs = lazy(
  () => import("../components/Mechanic/CompletedJobs"),
);
const PendingJobs = lazy(() => import("../components/Mechanic/PendingJobs"));
const PartsRequest = lazy(() => import("../components/Mechanic/PartsRequest"));
const CreateCustomer = lazy(() => import("../pages/mechanic/CreateCustomer"));
const MechanicPurchase = lazy(
  () => import("../pages/mechanic/MechanicPurchase"),
);

const mechanicRoutes = [
  {
    path: "/mechanic",
    element: <MechanicDashboard />,
  },
  {
    path: "/mechanic/dashboard",
    element: <MechanicDashboard />,
  },
  {
    path: "/mechanic/create-customer",
    element: <CreateCustomer />,
  },
  {
    path: "/mechanic/purchase",
    element: <MechanicPurchase />,
  },
  {
    path: "/mechanic/profile",
    element: <MechanicProfile />,
  },
  {
    path: "/mechanic/work-orders",
    element: <MechanicWorkOrders />,
  },
  {
    path: "/mechanic/parts",
    element: <MechanicParts />,
  },

  {
    path: "/mechanic/invoices",
    element: <MechanicInvoices />,
  },
  {
    path: "/mechanic/invoices/:id",
    element: <MechanicInvoiceDetail />,
  },
  {
    path: "/mechanic/customers",
    element: <MechanicCustomers />,
  },
  {
    path: "/mechanic/customers/:id",
    element: <MechanicCustomerDetail />,
  },
  {
    path: "/mechanic/reports",
    element: <MechanicReports />,
  },

  {
    path: "/mechanic/jobs/:id",
    element: <MechanicJobDetail />,
  },
  {
    path: "/mechanic/all-jobs",
    element: <ALL_JOBS />,
  },
  {
    path: "/mechanic/completed-jobs",
    element: <CompletedJobs />,
  },
  {
    path: "/mechanic/pending-jobs",
    element: <PendingJobs />,
  },
  {
    path: "/mechanic/parts-requests",
    element: <PartsRequest />,
  },
];

const MechanicRoutes = () => {
  const element = useRoutes(mechanicRoutes);
  return (
    <Suspense fallback={<div>Loading mechanic pages…</div>}>{element}</Suspense>
  );
};

export default MechanicRoutes;
