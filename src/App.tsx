import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/common/Loading";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const OrganizationDetail = lazy(() => import("./pages/OrganizationDetail"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const RequirementDetail = lazy(() => import("./pages/RequirementDetail"));

function App() {
  return <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white"><Loading label="Opening workspace..." /></div>}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/organizations/:orgId" element={<ProtectedRoute><OrganizationDetail /></ProtectedRoute>} />
      <Route path="/organizations/:orgId/projects/:projectId" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/organizations/:orgId/projects/:projectId/requirements/:requirementId" element={<ProtectedRoute><RequirementDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>;
}

export default App;
