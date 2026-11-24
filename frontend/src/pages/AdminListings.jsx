import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveImageUrl } from "../api/client";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/AdminHeader";

function AdminListings() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await api.getHostAccommodations(user._id, token);
        setListings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [user, token]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      await api.deleteAccommodation(id, token);

      setListings((currentListings) =>
        currentListings.filter(
          (listing) => listing._id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="admin-listings-page">
        <div className="admin-listings-header">
          <div>
            <p className="admin-eyebrow">
              LISTINGS
            </p>

            <h1>Manage Listings</h1>
          </div>

          <Link
            to="/admin/create-listing"
            className="admin-primary-button"
          >
            Create Listing
          </Link>
        </div>

        {loading && <p>Loading listings...</p>}

        {error && (
          <p className="admin-error-message">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          listings.length === 0 && (
            <p>No listings found.</p>
          )}

        <div className="admin-listings-grid">
          {listings.map((listing) => (
            <div
              className="admin-listing-card"
              key={listing._id}
            >
              <img
                src={resolveImageUrl(listing.images?.[0]) || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"}
                alt={listing.title}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";
                }}
              />

              <div className="admin-listing-content">
                <h2>{listing.title}</h2>

                <p>{listing.location}</p>

                <p>
                  R{listing.price} per night
                </p>

                <div className="admin-listing-actions">
                  <Link
                    to={`/admin/listings/${listing._id}/edit`}
                    className="admin-edit-button"
                  >
                    Edit
                  </Link>

                  <button
                    className="admin-delete-button"
                    onClick={() =>
                      handleDelete(listing._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminListings;