/**
 * App.jsx – Root component.
 * Wraps the whole app in AuthProvider (JWT context) and sets up
 * client-side routing with React Router v6.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Location from './pages/Location';
import LocationDetails from './pages/LocationDetails';
import Login from './pages/Login';
import Reservations from './pages/Reservations';
import AdminDashboard from './pages/AdminDashboard';
import AdminListings from './pages/AdminListings';
import AdminLogin from './pages/AdminLogin';
import AdminReservations from './pages/AdminReservations';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/locations" element={<Location />} />
          <Route path="/locations/:id" element={<LocationDetails />} />
          <Route path="/login" element={<Login />} />

          {/* Protected – Reservations redirects internally if unauthenticated */}
          <Route path="/reservations" element={<Reservations />} />

          {/* Host dashboard */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedAdminRoute>
                <AdminListings />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/create-listing"
            element={
              <ProtectedAdminRoute>
                <CreateListing />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/listings/:id/edit"
            element={
              <ProtectedAdminRoute>
                <UpdateListing />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedAdminRoute>
                <AdminReservations />
              </ProtectedAdminRoute>
            }
          />

          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
