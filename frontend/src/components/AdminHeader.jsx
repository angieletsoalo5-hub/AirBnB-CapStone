import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <Link to="/admin" className="admin-logo">
        airbnb
      </Link>

      <nav className="admin-navigation">
        <Link to="/admin">Dashboard</Link>

        <Link to="/admin/listings">
          Listings
        </Link>

        <Link to="/admin/create-listing">
          Create Listing
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