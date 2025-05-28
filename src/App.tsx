import React, { useEffect } from 'react'; // Import useEffect
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Lectures from "./pages/Lectures";
import Stage from "./pages/Stage";
import Subject from "./pages/Subject";
import Lecture from "./pages/Lecture";
import Login from "./pages/Login"; // Import Login page
import Register from "./pages/Register"; // Import Register page
import AIChat from "./pages/AIChat"; // Import AIChat page
import LectureTranslation from "./pages/LectureTranslation"; // Import LectureTranslation page
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout"; // Import Layout component
import ThemeToggle from "./components/ui/theme-toggle"; // Import ThemeToggle component
import AdminDashboard from "./pages/AdminDashboard"; // Import AdminDashboard page
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute component
import { logActivity } from './firebase/activityLogger'; // Import logActivity
import { auth } from './firebase/firebase'; // Import auth to check user status
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

const queryClient = new QueryClient();

const App = () => {
  // Removed activity logging for page_view and user_visit as per new requirements.
  // These types are not in ALLOWED_ACTIVITY_TYPES in activityLogger.ts.

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}> {/* Protect routes that require authentication */}
              <Route path="/lectures" element={<Layout><Lectures /></Layout>} />
              <Route path="/lectures/:stageId" element={<Layout><Stage /></Layout>} />
              <Route path="/lectures/:stageId/:subjectId" element={<Layout><Subject /></Layout>} />
              <Route path="/lectures/:stageId/:subjectId/:lectureId" element={<Layout><Lecture /></Layout>} />
              <Route path="/lecture-translation" element={<Layout><LectureTranslation /></Layout>} />
              <Route path="/ai-chat" element={<Layout><AIChat /></Layout>} />
            </Route>
            {/* Protected Admin Route */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-dashboard" element={<Layout><AdminDashboard /></Layout>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ThemeToggle /> {/* Add ThemeToggle here */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
