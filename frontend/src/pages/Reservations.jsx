import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getMyReservations,
  cancelReservation,
} from "../services/api.js";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await getMyReservations();
        setReservations(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleCancel = async (reservationId) => {
    try {
      setCancellingId(reservationId);
      setError("");

      const updatedReservation =
        await cancelReservation(reservationId);

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation._id === reservationId
            ? updatedReservation
            : reservation
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="reservations-page">
        <h1>My Reservations</h1>

        {loading && <p>Loading reservations...</p>}

        {error && (
          <p className="reservations-error">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <p>You do not have any reservations yet.</p>
          )}

        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div
              className="reservation-card"
              key={reservation._id}
            >
              <h2>
                {reservation.accommodation?.title ||
                  "Accommodation"}
              </h2>

              <p>
                <strong>Location:</strong>{" "}
                {reservation.accommodation?.location ||
                  "Not available"}
              </p>

              <p>
                <strong>Check in:</strong>{" "}
                {new Date(
                  reservation.checkIn
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Check out:</strong>{" "}
                {new Date(
                  reservation.checkOut
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Guests:</strong>{" "}
                {reservation.guests}
              </p>

              <p>
                <strong>Total:</strong> R
                {reservation.totalPrice}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {reservation.status}
              </p>

              {reservation.status === "confirmed" && (
                <button
                  className="cancel-reservation-button"
                  onClick={() =>
                    handleCancel(reservation._id)
                  }
                  disabled={
                    cancellingId === reservation._id
                  }
                >
                  {cancellingId === reservation._id
                    ? "Cancelling..."
                    : "Cancel Reservation"}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Reservations;