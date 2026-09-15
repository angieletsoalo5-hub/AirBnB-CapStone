import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getAccommodationById,
  createReservation,
} from "../services/api.js";

const fallbackImages = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1000&q=80",
];

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [accommodation, setAccommodation] =
    useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [bookingMessage, setBookingMessage] =
    useState("");
  const [bookingLoading, setBookingLoading] =
    useState(false);

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        const data =
          await getAccommodationById(id);

        setAccommodation(data);
      } catch (error) {
        console.error(
          "Error loading accommodation:",
          error
        );
      }
    };

    loadAccommodation();
  }, [id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const difference =
      endDate - startDate;

    const calculatedNights = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    return calculatedNights > 0
      ? calculatedNights
      : 0;
  }, [checkIn, checkOut]);

  const stayPrice =
    accommodation && nights > 0
      ? nights * accommodation.price
      : 0;

  const cleaningFee =
    accommodation?.cleaningFee || 0;

  const serviceFee =
    accommodation?.serviceFee || 0;

  const occupancyTaxes =
    accommodation?.occupancyTaxes || 0;

  const weeklyDiscountPercent =
    accommodation?.weeklyDiscount || 0;

  const weeklyDiscount =
    nights >= 7
      ? Math.round(
          stayPrice *
            (weeklyDiscountPercent / 100)
        )
      : 0;

  const estimatedTotal =
    stayPrice -
    weeklyDiscount +
    cleaningFee +
    serviceFee +
    occupancyTaxes;

  const handleBooking = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingMessage(
        "Please select your check-in and check-out dates."
      );

      return;
    }

    if (nights <= 0) {
      setBookingMessage(
        "Check-out date must be after the check-in date."
      );

      return;
    }

    if (
      Number(guests) >
      accommodation.maxGuests
    ) {
      setBookingMessage(
        `This stay allows a maximum of ${accommodation.maxGuests} guests.`
      );

      return;
    }

    try {
      setBookingLoading(true);
      setBookingMessage("");

      await createReservation({
        accommodation:
          accommodation._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        totalPrice: estimatedTotal,
      });

      navigate("/reservations");
    } catch (error) {
      setBookingMessage(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (!accommodation) {
    return (
      <div>
        <Navbar />

        <p className="loading-text">
          Loading accommodation...
        </p>
      </div>
    );
  }

  const propertyImages =
    accommodation.images?.length > 0
      ? [
          ...accommodation.images,
          ...fallbackImages,
        ].slice(0, 5)
      : fallbackImages;

  return (
    <div className="listing-details-wrapper">
      <Navbar />

      <main className="listing-details-page">
        {/* TITLE */}

        <section className="listing-details-heading">
          <div>
            <h1>
              {accommodation.title}
            </h1>

            <div className="listing-heading-meta">
              <span>★ 4.9</span>

              <span>·</span>

              <span>Guest favourite</span>

              <span>·</span>

              <span>
                {accommodation.location}
              </span>
            </div>
          </div>

          <div className="listing-heading-actions">
            <button type="button">
              ↗ Share
            </button>

            <button type="button">
              ♡ Save
            </button>
          </div>
        </section>

        {/* IMAGE GALLERY */}

        <section className="listing-gallery">
          <div className="listing-gallery-main">
            <img
              src={propertyImages[0]}
              alt={accommodation.title}
              onError={(e) => {
                e.currentTarget.src =
                  fallbackImages[0];
              }}
            />
          </div>

          <div className="listing-gallery-small">
            {propertyImages
              .slice(1, 5)
              .map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${accommodation.title} ${
                    index + 2
                  }`}
                  onError={(e) => {
                    e.currentTarget.src =
                      fallbackImages[
                        index + 1
                      ];
                  }}
                />
              ))}
          </div>
        </section>

        {/* MAIN CONTENT */}

        <section className="listing-details-layout">
          <div className="listing-details-left">
            {/* SUMMARY */}

            <div className="listing-summary-section">
              <h2>
                {accommodation.type} in{" "}
                {accommodation.location}
              </h2>

              <p className="listing-summary-meta">
                Up to{" "}
                {accommodation.maxGuests} guests ·{" "}
                {accommodation.bedrooms} bedroom
                {accommodation.bedrooms !== 1
                  ? "s"
                  : ""}{" "}
                ·{" "}
                {accommodation.bathrooms} bathroom
                {accommodation.bathrooms !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* HOST */}

            <div className="listing-host-section">
              <div className="host-avatar">
                A
              </div>

              <div>
                <h3>
                  Hosted by{" "}
                  {accommodation.host
                    ?.username ||
                    "Airbnb Host"}
                </h3>

                <p>
                  Experienced host · Great
                  communication
                </p>
              </div>
            </div>

            {/* HIGHLIGHTS */}

            <div className="listing-highlights">
              <div className="listing-highlight">
                <span>🏡</span>

                <div>
                  <h3>
                    Entire place
                  </h3>

                  <p>
                    You'll have the property
                    to yourself.
                  </p>
                </div>
              </div>

              <div className="listing-highlight">
                <span>✨</span>

                <div>
                  <h3>
                    Guest favourite
                  </h3>

                  <p>
                    One of the most loved homes
                    by guests.
                  </p>
                </div>
              </div>

              <div className="listing-highlight">
                <span>📍</span>

                <div>
                  <h3>
                    Great location
                  </h3>

                  <p>
                    Enjoy easy access to the
                    surrounding area.
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="listing-content-section">
              <h2>About this stay</h2>

              <p className="listing-description">
                {accommodation.description}
              </p>
            </div>

            {/* AMENITIES */}

            <div className="listing-content-section">
              <h2>
                What this place offers
              </h2>

              {accommodation.amenities?.length >
              0 ? (
                <div className="amenities-grid">
                  {accommodation.amenities.map(
                    (amenity, index) => (
                      <div
                        className="amenity-item"
                        key={index}
                      >
                        <span>✓</span>

                        <p>{amenity}</p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="amenities-grid">
                  <div className="amenity-item">
                    <span>✓</span>
                    <p>WiFi</p>
                  </div>

                  <div className="amenity-item">
                    <span>✓</span>
                    <p>Kitchen</p>
                  </div>

                  <div className="amenity-item">
                    <span>✓</span>
                    <p>Free parking</p>
                  </div>

                  <div className="amenity-item">
                    <span>✓</span>
                    <p>Private entrance</p>
                  </div>
                </div>
              )}
            </div>

            {/* LOCATION */}

            <div className="listing-content-section">
              <h2>Where you'll be</h2>

              <p className="listing-description">
                {accommodation.location}
              </p>

              <div className="listing-map-placeholder">
                <div>
                  <span>📍</span>

                  <h3>
                    {accommodation.location}
                  </h3>

                  <p>
                    Exact location provided after
                    booking.
                  </p>
                </div>
              </div>
            </div>

            {/* THINGS TO KNOW */}

            <div className="listing-content-section">
              <h2>Things to know</h2>

              <div className="things-to-know-grid">
                <div>
                  <h3>House rules</h3>

                  <p>
                    Check-in after 15:00
                  </p>

                  <p>
                    Checkout before 11:00
                  </p>

                  <p>
                    Maximum{" "}
                    {accommodation.maxGuests}{" "}
                    guests
                  </p>
                </div>

                <div>
                  <h3>Safety</h3>

                  <p>
                    Smoke alarm
                  </p>

                  <p>
                    Secure property
                  </p>

                  <p>
                    Emergency contact available
                  </p>
                </div>

                <div>
                  <h3>
                    Cancellation policy
                  </h3>

                  <p>
                    Review the cancellation
                    policy before booking.
                  </p>

                  <p>
                    Reservations can be cancelled
                    from My Reservations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING CARD */}

          <aside className="listing-booking-column">
            <div className="listing-price-box">
              <div className="booking-price-heading">
                <h3>
                  R{accommodation.price}
                </h3>

                <span>night</span>
              </div>

              <div className="booking-rating">
                ★ 4.9 · Guest favourite
              </div>

              <form
                className="booking-form"
                onSubmit={handleBooking}
              >
                <div className="booking-date-row">
                  <div className="booking-field">
                    <label>
                      Check in
                    </label>

                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) =>
                        setCheckIn(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className="booking-field">
                    <label>
                      Check out
                    </label>

                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) =>
                        setCheckOut(
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>

                <div className="booking-field booking-guests-field">
                  <label>Guests</label>

                  <input
                    type="number"
                    min="1"
                    max={
                      accommodation.maxGuests
                    }
                    value={guests}
                    onChange={(e) =>
                      setGuests(
                        e.target.value
                      )
                    }
                    required
                  />
                </div>

                {bookingMessage && (
                  <p className="booking-message">
                    {bookingMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="booking-button"
                  disabled={bookingLoading}
                >
                  {bookingLoading
                    ? "Booking..."
                    : "Reserve"}
                </button>
              </form>

              <p className="booking-note">
                You won't be charged until your
                reservation is confirmed.
              </p>

              {nights > 0 && (
                <div className="booking-breakdown">
                  <div>
                    <span>
                      R{accommodation.price} ×{" "}
                      {nights} night
                      {nights !== 1 ? "s" : ""}
                    </span>

                    <span>
                      R{stayPrice}
                    </span>
                  </div>

                  {weeklyDiscount > 0 && (
                    <div className="booking-discount">
                      <span>
                        Weekly discount
                      </span>

                      <span>
                        -R{weeklyDiscount}
                      </span>
                    </div>
                  )}

                  {cleaningFee > 0 && (
                    <div>
                      <span>
                        Cleaning fee
                      </span>

                      <span>
                        R{cleaningFee}
                      </span>
                    </div>
                  )}

                  {serviceFee > 0 && (
                    <div>
                      <span>
                        Service fee
                      </span>

                      <span>
                        R{serviceFee}
                      </span>
                    </div>
                  )}

                  {occupancyTaxes > 0 && (
                    <div>
                      <span>
                        Occupancy taxes
                      </span>

                      <span>
                        R{occupancyTaxes}
                      </span>
                    </div>
                  )}

                  <div className="booking-total">
                    <strong>
                      Total
                    </strong>

                    <strong>
                      R{estimatedTotal}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default ListingDetails;