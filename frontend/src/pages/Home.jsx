import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getAccommodations,
  getAvailableAccommodations,
} from "../services/api.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";

function Home() {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] =
    useState([]);

  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        const data = await getAccommodations();

        setAccommodations(data);
        setFilteredAccommodations(data);
      } catch (error) {
        console.error(
          "Error loading accommodations:",
          error
        );
      }
    };

    loadAccommodations();
  }, []);

  const handleSearch = async () => {
    try {
      setSearching(true);
      setSearchError("");

      if (
        (checkIn && !checkOut) ||
        (!checkIn && checkOut)
      ) {
        setSearchError(
          "Please select both check-in and check-out dates."
        );
        return;
      }

      if (
        checkIn &&
        checkOut &&
        new Date(checkOut) <= new Date(checkIn)
      ) {
        setSearchError(
          "Check-out date must be after check-in date."
        );
        return;
      }

      let accommodationsToSearch = accommodations;

      if (checkIn && checkOut) {
        accommodationsToSearch =
          await getAvailableAccommodations(
            checkIn,
            checkOut
          );
      }

      const searchTerm = searchLocation
        .trim()
        .toLowerCase();

      const guests = Number(guestCount);

      const results = accommodationsToSearch.filter(
        (accommodation) => {
          const title =
            accommodation.title?.toLowerCase() || "";

          const location =
            accommodation.location?.toLowerCase() || "";

          const matchesLocation =
            !searchTerm ||
            title.includes(searchTerm) ||
            location.includes(searchTerm);

          const matchesGuests =
            !guestCount ||
            accommodation.maxGuests >= guests;

          return matchesLocation && matchesGuests;
        }
      );

      setFilteredAccommodations(results);
    } catch (error) {
      setSearchError(error.message);
      setFilteredAccommodations([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="airbnb-home">
      <Navbar />

      <main className="home-page">
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">
              FIND YOUR PERFECT GETAWAY
            </p>

            <h1>
              Find your next stay
            </h1>

            <p className="hero-subtitle">
              Search unique homes, stays and experiences
              for your next trip.
            </p>
          </div>

          {/* SEARCH */}
          <div className="search-bar">
            <div className="search-item">
              <span>Where</span>

              <input
                type="text"
                placeholder="Search destinations"
                value={searchLocation}
                onChange={(e) =>
                  setSearchLocation(e.target.value)
                }
              />
            </div>

            <div className="search-item">
              <span>Check in</span>

              <input
                type="date"
                value={checkIn}
                onChange={(e) =>
                  setCheckIn(e.target.value)
                }
              />
            </div>

            <div className="search-item">
              <span>Check out</span>

              <input
                type="date"
                value={checkOut}
                onChange={(e) =>
                  setCheckOut(e.target.value)
                }
              />
            </div>

            <div className="search-item">
              <span>Who</span>

              <input
                type="number"
                min="1"
                placeholder="Add guests"
                value={guestCount}
                onChange={(e) =>
                  setGuestCount(e.target.value)
                }
              />
            </div>

            <button
              className="search-button"
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>

          {searchError && (
            <p className="search-error">
              {searchError}
            </p>
          )}
        </section>

        {/* AVAILABLE STAYS */}
        <section className="listings-section home-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                STAYS
              </p>

              <h2>Available stays</h2>
            </div>

            <p>
              Explore places ready for your next trip.
            </p>
          </div>

          {filteredAccommodations.length === 0 ? (
            <div className="no-results">
              <h3>No stays found</h3>

              <p>
                Try another destination, date range or
                guest count.
              </p>
            </div>
          ) : (
            <div className="listings-grid">
              {filteredAccommodations.map(
                (accommodation) => (
                  <Link
                    to={`/listing/${accommodation._id}`}
                    className="listing-card"
                    key={accommodation._id}
                  >
                    <div className="listing-image-wrapper">
                      <img
                        src={
                          accommodation.images?.[0] ||
                          fallbackImage
                        }
                        alt={accommodation.title}
                        onError={(e) => {
                          e.currentTarget.src =
                            fallbackImage;
                        }}
                      />

                      <span className="guest-favourite">
                        Guest favourite
                      </span>
                    </div>

                    <div className="listing-card-content">
                      <div className="listing-card-title-row">
                        <h3>
                          {accommodation.title}
                        </h3>

                        <span>★ 4.9</span>
                      </div>

                      <p className="listing-location">
                        {accommodation.location}
                      </p>

                      <p className="listing-details">
                        {accommodation.bedrooms} bedroom
                        {accommodation.bedrooms !== 1
                          ? "s"
                          : ""}{" "}
                        · up to{" "}
                        {accommodation.maxGuests} guests
                      </p>

                      <p className="listing-price">
                        <strong>
                          R{accommodation.price}
                        </strong>{" "}
                        night
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        {/* INSPIRATION */}
        <section className="home-section inspiration-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                EXPLORE
              </p>

              <h2>
                Inspiration for your next trip
              </h2>
            </div>
          </div>

          <div className="inspiration-grid">
            <article className="inspiration-card">
              <img
                src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=80"
                alt="Cape Town"
              />

              <div>
                <h3>Cape Town</h3>
                <p>
                  Mountains, beaches and city adventures.
                </p>
              </div>
            </article>

            <article className="inspiration-card">
              <img
                src="https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&w=900&q=80"
                alt="Johannesburg"
              />

              <div>
                <h3>Johannesburg</h3>
                <p>
                  Culture, food and unforgettable city
                  stays.
                </p>
              </div>
            </article>

            <article className="inspiration-card">
              <img
                src="https://images.unsplash.com/photo-1596395819057-e37f55a8516b?auto=format&fit=crop&w=900&q=80"
                alt="Durban"
              />

              <div>
                <h3>Durban</h3>
                <p>
                  Warm beaches and relaxed coastal
                  escapes.
                </p>
              </div>
            </article>

            <article className="inspiration-card">
              <img
                src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80"
                alt="Nature getaway"
              />

              <div>
                <h3>Nature escapes</h3>
                <p>
                  Slow down and reconnect with nature.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* EXPERIENCES */}
        <section className="home-section experiences-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                EXPERIENCES
              </p>

              <h2>
                Discover Airbnb experiences
              </h2>
            </div>
          </div>

          <div className="experiences-grid">
            <article className="experience-card experience-one">
              <div className="experience-overlay">
                <p>THINGS TO DO</p>

                <h3>
                  Discover unforgettable experiences
                </h3>

                <button type="button">
                  Explore experiences
                </button>
              </div>
            </article>

            <article className="experience-card experience-two">
              <div className="experience-overlay">
                <p>ONLINE EXPERIENCES</p>

                <h3>
                  Connect with people from around the
                  world
                </h3>

                <button type="button">
                  Discover more
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* SHOP AIRBNB */}
        <section className="home-section shop-airbnb-section">
          <div className="shop-airbnb-content">
            <p className="section-eyebrow">
              SHOP AIRBNB
            </p>

            <h2>
              Bring the Airbnb experience home
            </h2>

            <p>
              Discover travel-inspired essentials and
              products designed for comfortable stays.
            </p>

            <button type="button">
              Shop now
            </button>
          </div>

          <div className="shop-airbnb-image">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="Airbnb inspired interior"
            />
          </div>
        </section>

        {/* FUTURE GETAWAYS */}
        <section className="home-section future-getaways">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                EXPLORE MORE
              </p>

              <h2>
                Inspiration for future getaways
              </h2>
            </div>
          </div>

          <div className="future-tabs">
            <button type="button">
              Popular
            </button>

            <button type="button">
              Arts & culture
            </button>

            <button type="button">
              Outdoors
            </button>

            <button type="button">
              Mountains
            </button>

            <button type="button">
              Beach
            </button>

            <button type="button">
              Unique stays
            </button>
          </div>

          <div className="future-links-grid">
            <div>
              <h4>Cape Town</h4>
              <p>Holiday rentals</p>
            </div>

            <div>
              <h4>Durban</h4>
              <p>Beachfront stays</p>
            </div>

            <div>
              <h4>Johannesburg</h4>
              <p>Apartment rentals</p>
            </div>

            <div>
              <h4>Stellenbosch</h4>
              <p>Wine country stays</p>
            </div>

            <div>
              <h4>Knysna</h4>
              <p>Nature getaways</p>
            </div>

            <div>
              <h4>Hermanus</h4>
              <p>Coastal homes</p>
            </div>

            <div>
              <h4>Pretoria</h4>
              <p>Weekend stays</p>
            </div>

            <div>
              <h4>Franschhoek</h4>
              <p>Luxury retreats</p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="airbnb-footer">
        <div className="footer-grid">
          <div>
            <h4>Support</h4>
            <p>Help Centre</p>
            <p>AirCover</p>
            <p>Cancellation options</p>
            <p>Report a concern</p>
          </div>

          <div>
            <h4>Hosting</h4>
            <p>Airbnb your home</p>
            <p>AirCover for Hosts</p>
            <p>Hosting resources</p>
            <p>Community forum</p>
          </div>

          <div>
            <h4>Airbnb</h4>
            <p>Newsroom</p>
            <p>New features</p>
            <p>Careers</p>
            <p>Investors</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Airbnb Clone · Privacy · Terms ·
            Sitemap
          </p>

          <p>
            English (ZA) · ZAR
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;