import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/AppLayout';
import { RequireRole } from './components/RequireRole';
import { PageBackground } from './components/PageBackground';
import { Landing } from './pages/Landing';
import { CreateAccount } from './pages/CreateAccount';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { BrowseItems } from './pages/BrowseItems';
import { ReportItem } from './pages/ReportItem';
import { Matches } from './pages/Matches';
import { ClaimVerification } from './pages/ClaimVerification';
import { Analytics } from './pages/Analytics';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <PageBackground />
        <Toaster position="bottom-right" richColors />
        <div className="relative z-[1]">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<CreateAccount />} />
            <Route path="/app" element={<RequireRole role="user"><AppLayout /></RequireRole>}>
              <Route index element={<Dashboard />} />
              <Route path="browse" element={<BrowseItems />} />
              <Route path="report" element={<ReportItem />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/admin" element={<RequireRole role="admin"><AppLayout /></RequireRole>}>
              <Route index element={<AdminDashboard />} />
              <Route path="browse" element={<BrowseItems />} />
              <Route path="report" element={<ReportItem />} />
              <Route path="matches" element={<Matches />} />
              <Route path="claims" element={<ClaimVerification />} />
              <Route path="users" element={<Users />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>);

}
