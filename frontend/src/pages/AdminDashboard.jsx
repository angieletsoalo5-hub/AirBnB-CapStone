import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="admin-dashboard-content">
        <p className="admin-eyebrow">
          ADMIN DASHBOARD
        </p>

        <h1>Welcome, {user?.username || "Host"}</h1>

        <p>
          Manage your Airbnb listings and reservations
          from one place.
        </p>

        <div className="admin-dashboard-cards">
          <Link
            to="/admin/listings"
            className="admin-dashboard-card"
          >
            <h2>View Listings</h2>

            <p>
              View, update and delete your property
              listings.
            </p>
          </Link>

          <Link
            to="/admin/create-listing"
            className="admin-dashboard-card"
          >
            <h2>Create Listing</h2>

            <p>
              Add a new property to your Airbnb
              listings.
            </p>
          </Link>

          <Link
            to="/admin/reservations"
            className="admin-dashboard-card"
          >
            <h2>Reservations</h2>

            <p>
              View reservations made by customers.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;