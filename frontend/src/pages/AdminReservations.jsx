import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/reservations/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch reservations"
          );
        }

        setReservations(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

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
                    R{reservation.totalPrice}
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