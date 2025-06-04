import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { logActivity } from './firebase/activityLogger';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import News from "@/pages/News";
import About from "@/pages/About";
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import Resources from "./pages/Resources";
import Challenges from "./pages/Challenges";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        logActivity({ userId: user.uid, type: 'app_loaded', details: JSON.stringify({ pathname: window.location.pathname, search: window.location.search }) });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:newsId" element={<News />} />
                <Route path="/about" element={<About />} />
                <Route path="/resources" element={<Layout><Resources /></Layout>} />
                {/* صفحة التحديات البرمجية متاحة للجميع */}
                <Route path="/challenges" element={<Layout><Challenges /></Layout>} />
                <Route element={<ProtectedRoute />}>
                </Route>
                <Route element={<ProtectedRoute allowedRoles={['admin', 'owner']} />}>
                  <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
                </Route>
                <Route path="/AlphaTeam/*" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
