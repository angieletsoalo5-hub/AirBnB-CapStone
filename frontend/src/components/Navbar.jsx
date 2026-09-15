import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav>
      <div>
        <Link to="/">
          <h2>airbnb</h2>
        </Link>
      </div>

      <div>
        <Link to="/">Home</Link>

        <Link to="/reservations">
          My Reservations
        </Link>

        {token ? (
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;