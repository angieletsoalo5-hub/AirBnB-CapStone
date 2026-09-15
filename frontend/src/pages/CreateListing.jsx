import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";

function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "",
    price: "",
    image: "",
    amenities: "",
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
    weeklyDiscount: "",
    cleaningFee: "",
    serviceFee: "",
    occupancyTaxes: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must be logged in as an admin.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5001/api/accommodations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            type: formData.type,
            price: Number(formData.price),
            images: formData.image
              ? [formData.image]
              : [],
            amenities: formData.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            maxGuests: Number(formData.maxGuests),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            weeklyDiscount: Number(
              formData.weeklyDiscount || 0
            ),
            cleaningFee: Number(
              formData.cleaningFee || 0
            ),
            serviceFee: Number(
              formData.serviceFee || 0
            ),
            occupancyTaxes: Number(
              formData.occupancyTaxes || 0
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create listing"
        );
      }

      navigate("/admin/listings");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />

      <main className="create-listing-page">
        <div className="create-listing-container">
          <p className="admin-eyebrow">
            CREATE LISTING
          </p>

          <h1>Add a new property</h1>

          <p className="create-listing-subtitle">
            Enter the property details below.
          </p>

          <form
            className="create-listing-form"
            onSubmit={handleSubmit}
          >
            <div className="create-listing-field">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-listing-field">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-listing-field">
              <label>Property Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select property type
                </option>
                <option value="Apartment">
                  Apartment
                </option>
                <option value="House">
                  House
                </option>
                <option value="Villa">
                  Villa
                </option>
                <option value="Guest suite">
                  Guest suite
                </option>
              </select>
            </div>

            <div className="create-listing-field full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="create-listing-field">
              <label>Price per night</label>

              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-listing-field">
              <label>Maximum Guests</label>

              <input
                type="number"
                name="maxGuests"
                min="1"
                value={formData.maxGuests}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-listing-field">
              <label>Bedrooms</label>

              <input
                type="number"
                name="bedrooms"
                min="1"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-listing-field">
              <label>Bathrooms</label>

              <input
                type="number"
                name="bathrooms"
                min="1"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-listing-field full-width">
              <label>Image URL</label>

              <input
                type="url"
                name="image"
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className="create-listing-field full-width">
              <label>Amenities</label>

              <input
                type="text"
                name="amenities"
                placeholder="WiFi, Parking, Pool"
                value={formData.amenities}
                onChange={handleChange}
              />
            </div>

            <div className="create-listing-field">
              <label>Weekly Discount</label>

              <input
                type="number"
                name="weeklyDiscount"
                min="0"
                value={formData.weeklyDiscount}
                onChange={handleChange}
              />
            </div>

            <div className="create-listing-field">
              <label>Cleaning Fee</label>

              <input
                type="number"
                name="cleaningFee"
                min="0"
                value={formData.cleaningFee}
                onChange={handleChange}
              />
            </div>

            <div className="create-listing-field">
              <label>Service Fee</label>

              <input
                type="number"
                name="serviceFee"
                min="0"
                value={formData.serviceFee}
                onChange={handleChange}
              />
            </div>

            <div className="create-listing-field">
              <label>Occupancy Taxes</label>

              <input
                type="number"
                name="occupancyTaxes"
                min="0"
                value={formData.occupancyTaxes}
                onChange={handleChange}
              />
            </div>

            {message && (
              <p className="admin-error-message full-width">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="admin-primary-button create-listing-submit"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Listing"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateListing;