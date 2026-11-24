import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/AdminHeader";

function AdminReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await api.getHostReservations(token);
        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [token]);

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="admin-reservations-page">
        <div className="admin-reservations-container">
          <p className="admin-eyebrow">
            RESERVATIONS
          </p>

          <h1>Manage Reservations</h1>

          <p className="admin-reservations-subtitle">
            View all customer bookings in one place.
          </p>

          {loading && <p>Loading reservations...</p>}

          {error && (
            <p className="admin-error-message">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            reservations.length === 0 && (
              <p>No reservations found.</p>
            )}

          <div className="admin-reservations-list">
            {reservations.map((reservation) => (
              <div
                className="admin-reservation-card"
                key={reservation._id}
              >
                <div>
                  <h2>
                    {reservation.accommodation?.title ||
                      "Accommodation"}
                  </h2>

                  <p>
                    <strong>Guest:</strong>{" "}
                    {reservation.user?.username ||
                      reservation.user?.email ||
                      "Unknown user"}
                  </p>

                  <p>
                    <strong>Check-in:</strong>{" "}
                    {new Date(
                      reservation.checkIn
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Check-out:</strong>{" "}
                    {new Date(
                      reservation.checkOut
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Guests:</strong>{" "}
                    {reservation.guests}
                  </p>

                  <p>
                    <strong>Total:</strong>{" "}
                    R{reservation.totalCost}
                  </p>
                </div>

                <span
                  className={`admin-reservation-status ${reservation.status}`}
                >
                  {reservation.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminReservations;