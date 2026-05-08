import React, { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";

const MechanicDashboard = lazy(
  () => import("../Pages/mechanic/MechanicDashboard"),
);
const MechanicProfile = lazy(() => import("../Pages/mechanic/MechanicProfile"));
const MechanicWorkOrders = lazy(
  () => import("../Pages/mechanic/MechanicWorkOrders"),
);
const MechanicParts = lazy(() => import("../Pages/mechanic/MechanicParts"));
const MechanicPartDetail = lazy(
  () => import("../Pages/mechanic/MechanicPartDetail"),
);
const MechanicInvoices = lazy(
  () => import("../Pages/mechanic/MechanicInvoices"),
);
const MechanicInvoiceDetail = lazy(
  () => import("../Pages/mechanic/MechanicInvoiceDetail"),
);
const MechanicCustomers = lazy(
  () => import("../Pages/mechanic/MechanicCustomers"),
);
const MechanicCustomerDetail = lazy(
  () => import("../Pages/mechanic/MechanicCustomerDetail"),
);
const MechanicReports = lazy(() => import("../Pages/mechanic/MechanicReports"));

const MechanicJobDetail = lazy(
  () => import("../Pages/mechanic/MechanicJobDetail"),
);
const ALL_JOBS = lazy(() => import("../Pages/mechanic/AllAssignedJobs"));
const CompletedJobs = lazy(() => import("../Mechanic/CompletedJobs"));
const PendingJobs = lazy(() => import("../Mechanic/PendingJobs"));
const PartsRequest = lazy(() => import("../Mechanic/PartsRequest"));

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
    path: "/mechanic/parts/:id",
    element: <MechanicPartDetail />,
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
