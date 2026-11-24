import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB");
}

function AdminReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReservations() {
      try {
        const data = await api.getHostReservations(token);
        if (active) setReservations(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReservations();
    return () => {
      active = false;
    };
  }, [token]);

  async function handleDelete(reservation) {
    const confirmed = window.confirm(
      "Delete this reservation? The dates will become available again."
    );
    if (!confirmed) return;

    try {
      setError("");
      setDeletingId(reservation._id);
      await api.cancelReservation(reservation._id, token);
      setReservations((current) =>
        current.filter((item) => item._id !== reservation._id)
      );
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="admin-reservations-page">
        <div className="admin-reservations-heading">
          <div>
            <h1>My Reservations</h1>
          </div>
        </div>

        {loading && (
          <p className="admin-state-message">Loading reservations…</p>
        )}
        {error && (
          <p className="admin-error-message" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && reservations.length === 0 && (
          <div className="admin-empty-state">
            <h2>No reservations yet</h2>
            <p>New guest bookings will appear here.</p>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="admin-reservations-table-wrap">
            <table className="admin-reservations-table">
              <thead>
                <tr>
                  <th scope="col">Booked by</th>
                  <th scope="col">Property</th>
                  <th scope="col">Checkin</th>
                  <th scope="col">Checkout</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      {reservation.user?.username ||
                        reservation.user?.email ||
                        "Guest"}
                    </td>
                    <td>{reservation.accommodation?.title || "Listing"}</td>
                    <td>{formatDate(reservation.checkIn)}</td>
                    <td>{formatDate(reservation.checkOut)}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete-button"
                        disabled={deletingId === reservation._id}
                        onClick={() => handleDelete(reservation)}
                      >
                        {deletingId === reservation._id
                          ? "Deleting…"
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AdminReservations;
