import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <Link to="/admin" className="admin-logo" aria-label="Airbnb host dashboard">
        <img src="/favicon.svg" alt="" aria-hidden="true" />
        <span>airbnb</span>
      </Link>

      <nav className="admin-navigation">
        <Link to="/admin">Dashboard</Link>

        <Link to="/admin/listings">
          Listings
        </Link>

        <Link to="/admin/create-listing">
          Create Listing
        </Link>
        <Link to="/admin/reservations">
          Reservations
        </Link>
      </nav>

      <div className="admin-profile">
        <button
          className="admin-profile-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Hello, {user.username || "Admin"} ▾
        </button>

        {menuOpen && (
          <div className="admin-profile-menu">
            <Link
              to="/admin/reservations"
              onClick={() => setMenuOpen(false)}
            >
              Reservations
            </Link>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;