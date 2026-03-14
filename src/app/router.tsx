import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Shell } from '@/components/layout/shell';
import { ProtectedRoute } from '@/components/layout/protected-route';

const LandingPage = lazy(() => import('@/pages/landing-page'));
const AuthPage = lazy(() => import('@/pages/auth-page'));
const ProjectsPage = lazy(() => import('@/pages/projects-page'));
const DashboardPage = lazy(() => import('@/pages/dashboard-page'));
const AdminPage = lazy(() => import('@/pages/admin-page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding-page'));
const MessagesPage = lazy(() => import('@/pages/messages-page'));
const ProjectCreatePage = lazy(() => import('@/pages/project-create-page'));

export function AppRouter() {
  return (
    <Shell>
      <Suspense fallback={<div>Loading page...</div>}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
            <Route path="/projects/new" element={<ProtectedRoute><ProjectCreatePage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Shell>
  );
}
