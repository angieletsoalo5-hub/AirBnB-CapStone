import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getAccommodations,
  getAvailableAccommodations,
} from "../services/api.js";
import { getListingRating } from "../utils/ratings.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";

function SearchResults() {
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "";

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");

        let data;

        if (checkIn && checkOut) {
          data = await getAvailableAccommodations(
            checkIn,
            checkOut
          );
        } else {
          data = await getAccommodations();
        }

        const searchTerm = location.trim().toLowerCase();
        const guestNumber = Number(guests);

        const filtered = data.filter((accommodation) => {
          const title =
            accommodation.title?.toLowerCase() || "";

          const accommodationLocation =
            accommodation.location?.toLowerCase() || "";

          const matchesLocation =
            !searchTerm ||
            title.includes(searchTerm) ||
            accommodationLocation.includes(searchTerm);

          const matchesGuests =
            !guests ||
            accommodation.maxGuests >= guestNumber;

          return matchesLocation && matchesGuests;
        });

        setAccommodations(filtered);
      } catch (err) {
        setError(
          err.message || "Unable to load accommodations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [location, checkIn, checkOut, guests]);

  return (
    <div className="search-results-page">
      <Navbar />

      <main className="search-results-container">
        {/* COMPACT SEARCH BAR */}
        <section className="results-search-bar">
          <div>
            <span>Location</span>
            <strong>{location || "Anywhere"}</strong>
          </div>

          <div>
            <span>Check in</span>
            <strong>{checkIn || "Add dates"}</strong>
          </div>

          <div>
            <span>Check out</span>
            <strong>{checkOut || "Add dates"}</strong>
          </div>

          <div>
            <span>Guests</span>
            <strong>
              {guests
                ? `${guests} guest${Number(guests) !== 1 ? "s" : ""}`
                : "Add guests"}
            </strong>
          </div>

          <Link to="/" className="results-search-button">
            🔍
          </Link>
        </section>

        {/* FILTER BUTTONS */}
        <section className="results-filters">
          <button type="button">Free cancellation</button>
          <button type="button">Type of place</button>
          <button type="button">Price</button>
          <button type="button">Instant Book</button>
          <button type="button">More filters</button>
        </section>

        {/* HEADING */}
        <section className="results-heading">
          <p>
            {accommodations.length}{" "}
            {accommodations.length === 1 ? "stay" : "stays"}
            {location ? ` in ${location}` : " available"}
          </p>

          <h1>Places to stay</h1>
        </section>

        {loading && (
          <div className="results-message">
            <p>Searching for stays...</p>
          </div>
        )}

        {error && (
          <div className="results-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && accommodations.length === 0 && (
          <div className="results-message">
            <h3>No stays found</h3>
            <p>
              Try another destination, date range or guest
              count.
            </p>

            <Link to="/">Change your search</Link>
          </div>
        )}

        {/* FIGMA-STYLE RESULTS */}
        {!loading && !error && accommodations.length > 0 && (
          <section className="search-results-list">
            {accommodations.map((accommodation) => (
              <Link
                to={`/listing/${accommodation._id}`}
                className="search-result-card"
                key={accommodation._id}
              >
                <div className="search-result-image">
                  <img
                    src={
                      accommodation.images?.[0] ||
                      fallbackImage
                    }
                    alt={accommodation.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </div>

                <div className="search-result-info">
                  <div className="search-result-top">
                    <div>
                      <p className="search-result-type">
                        {accommodation.type || "Entire home"} in{" "}
                        {accommodation.location}
                      </p>

                      <h2>{accommodation.title}</h2>
                    </div>

                    <span className="result-heart">♡</span>
                  </div>

                  <div className="result-divider"></div>

                  <p className="search-result-details">
                    {accommodation.maxGuests} guests ·{" "}
                    {accommodation.bedrooms} bedroom
                    {accommodation.bedrooms !== 1 ? "s" : ""} ·{" "}
                    {accommodation.bathrooms} bathroom
                    {accommodation.bathrooms !== 1 ? "s" : ""}
                  </p>

                  {accommodation.amenities?.length > 0 && (
                    <p className="search-result-amenities">
                      {accommodation.amenities
                        .slice(0, 3)
                        .join(" · ")}
                    </p>
                  )}

                  <div className="search-result-bottom">
                    <span className="result-rating">
  ★ {getListingRating(accommodation)}
</span>

                    <p className="result-price">
                      <strong>
                        R{accommodation.price}
                      </strong>{" "}
                      / night
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default SearchResults;