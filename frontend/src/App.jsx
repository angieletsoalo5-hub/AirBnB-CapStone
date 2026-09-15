import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Reservations from "./pages/Reservations";
import ListingDetails from "./pages/ListingDetails";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminListings from "./pages/AdminListings";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import AdminReservations from "./pages/AdminReservations";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/reservations"
        element={<Reservations />}
      />

      <Route
        path="/listing/:id"
        element={<ListingDetails />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

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
    </Routes>
  );
}

export default App;
