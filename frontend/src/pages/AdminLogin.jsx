import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const user = await login(email.trim(), password);

      if (user.role !== "host") {
        logout();
        setMessage("Host access only. Sign in with a host account.");
        return;
      }

      navigate("/admin");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <img src="/favicon.svg" alt="" aria-hidden="true" />
          <span>airbnb</span>
        </div>

        <h1>Admin Login</h1>

        <p>
          Sign in to manage your Airbnb listings.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="admin-login-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="admin-login-field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {message && (
            <p className="admin-login-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>
        </form>
        <Link to="/login" className="admin-login-guest-link">
          Back to guest login
        </Link>
      </div>
    </main>
  );
}

export default AdminLogin;