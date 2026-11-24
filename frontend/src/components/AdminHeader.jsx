import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
      <div className="admin-header-top">
        <Link to="/admin" className="admin-logo" aria-label="Host dashboard">
          <img src="/favicon.svg" alt="" aria-hidden="true" />
          <span>airbnb</span>
        </Link>

        <div className="admin-profile">
          <span className="admin-profile-name">{user?.username || "Host"}</span>
          <button
            type="button"
            className="admin-profile-button"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="admin-profile-avatar">
              {(user?.username?.[0] || "H").toUpperCase()}
            </span>
          </button>

          {menuOpen && (
            <div className="admin-profile-menu">
              <Link to="/admin/listings" onClick={() => setMenuOpen(false)}>
                Your listings
              </Link>
              <Link to="/admin/reservations" onClick={() => setMenuOpen(false)}>
                Reservations
              </Link>
              <button type="button" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <nav className="admin-navigation" aria-label="Host navigation">
        <NavLink to="/admin/reservations">View Reservations</NavLink>
        <NavLink to="/admin/listings">View Listings</NavLink>
        <NavLink to="/admin/create-listing">Create Listing</NavLink>
      </nav>
    </header>
  );
}

export default AdminHeader;