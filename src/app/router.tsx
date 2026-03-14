import { Suspense, lazy, type ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
const CommunityPage = lazy(() => import('@/pages/community-page'));
const DiscussionsPage = lazy(() => import('@/pages/discussions-page'));
const PostsPage = lazy(() => import('@/pages/posts-page'));
const CollaborationPage = lazy(() => import('@/pages/collaboration-page'));
const PortfolioPage = lazy(() => import('@/pages/portfolio-page'));
const AnalyticsPage = lazy(() => import('@/pages/analytics-page'));
const BillingPage = lazy(() => import('@/pages/billing-page'));

const Animated = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
);

export function AppRouter() {
  return (
    <Shell>
      <Suspense fallback={<div className="rounded-lg border border-border p-4">Loading page…</div>}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Animated><LandingPage /></Animated>} />
            <Route path="/auth" element={<Animated><AuthPage /></Animated>} />
            <Route path="/projects" element={<Animated><ProjectsPage /></Animated>} />
            <Route path="/community" element={<Animated><CommunityPage /></Animated>} />
            <Route path="/discussions" element={<Animated><DiscussionsPage /></Animated>} />
            <Route path="/posts" element={<Animated><PostsPage /></Animated>} />
            <Route path="/portfolio/:username" element={<Animated><PortfolioPage /></Animated>} />
            <Route path="/analytics" element={<ProtectedRoute><Animated><AnalyticsPage /></Animated></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Animated><BillingPage /></Animated></ProtectedRoute>} />
            <Route path="/collaboration" element={<ProtectedRoute><Animated><CollaborationPage /></Animated></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Animated><OnboardingPage /></Animated></ProtectedRoute>} />
            <Route path="/projects/new" element={<ProtectedRoute><Animated><ProjectCreatePage /></Animated></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Animated><MessagesPage /></Animated></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Animated><DashboardPage /></Animated></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><Animated><AdminPage /></Animated></ProtectedRoute>} />
            <Route path="*" element={<div className="rounded-lg border border-border p-6">Page not found.</div>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Shell>
  );
}
