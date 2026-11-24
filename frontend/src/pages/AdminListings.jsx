import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveImageUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";

const fallbackImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";

function AdminListings() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadListings() {
      try {
        const data = await api.getHostAccommodations(user._id, token);
        if (active) setListings(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadListings();
    return () => {
      active = false;
    };
  }, [user, token]);

  async function handleDelete(listing) {
    const confirmed = window.confirm(
      `Delete "${listing.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setError("");
      await api.deleteAccommodation(listing._id, token);
      setListings((current) =>
        current.filter((item) => item._id !== listing._id)
      );
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="admin-listings-page">
        <div className="admin-listings-heading">
          <h1>My Hotel List</h1>
        </div>

        {loading && <p className="admin-state-message">Loading your listings…</p>}
        {error && (
          <p className="admin-error-message" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="admin-empty-state">
            <h2>No places yet</h2>
            <p>Create a listing to start welcoming guests.</p>
            <Link to="/admin/create-listing" className="admin-primary-button">
              Create a listing
            </Link>
          </div>
        )}

        <div className="admin-listings-list">
          {listings.map((listing) => {
            const imageUrl = resolveImageUrl(listing.images?.[0]) || fallbackImage;
            const amenities = listing.amenities?.slice(0, 3).join(" · ");

            return (
              <article className="admin-listing-row" key={listing._id}>
                <div className="admin-listing-media">
                  <img
                    src={imageUrl}
                    alt={listing.title}
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="admin-listing-actions">
                    <Link
                      to={`/admin/listings/${listing._id}/edit`}
                      className="admin-edit-button"
                    >
                      Update
                    </Link>
                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => handleDelete(listing)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="admin-listing-content">
                  <p className="admin-listing-type">
                    {listing.type || "Stay"} · {listing.location}
                  </p>
                  <h2>{listing.title}</h2>
                  <p className="admin-listing-details">
                    {listing.guests} guests · Entire home · {listing.bedrooms} beds ·{" "}
                    {listing.bathrooms} bath
                  </p>
                  <p className="admin-listing-amenities">
                    {amenities || "Amenities not listed"}
                  </p>
                  <p className="admin-listing-rating">
                    <span aria-hidden="true">★</span>{" "}
                    {Number(listing.rating ?? 0).toFixed(1)}
                    {" · "}
                    {listing.reviews ?? 0} reviews
                  </p>
                </div>

                <p className="admin-listing-price">
                  <strong>R{listing.price}</strong> <span>/ night</span>
                </p>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminListings;
