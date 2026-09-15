const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001/api";

export const getAccommodations = async () => {
  const response = await fetch(
    `${API_URL}/accommodations`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch accommodations"
    );
  }

  return response.json();
};

export const getAccommodationById = async (
  id
) => {
  const response = await fetch(
    `${API_URL}/accommodations/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch accommodation"
    );
  }

  return response.json();
};

export const loginUser = async (
  email,
  password
) => {
  const response = await fetch(
    `${API_URL}/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
};

export const getMyReservations =
  async () => {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/reservations/my-reservations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch reservations"
      );
    }

    return data;
  };

export const createReservation = async (
  reservationData
) => {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/reservations`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        reservationData
      ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create reservation"
    );
  }

  return data;
};

export const cancelReservation = async (
  reservationId
) => {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/reservations/${reservationId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to cancel reservation"
    );
  }

  return data;
};

export const getAvailableAccommodations =
  async (checkIn, checkOut) => {
    const response = await fetch(
      `${API_URL}/accommodations/available?checkIn=${encodeURIComponent(
        checkIn
      )}&checkOut=${encodeURIComponent(
        checkOut
      )}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to check availability"
      );
    }

    return data;
  };

export const deleteAccommodation = async (
  id
) => {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/accommodations/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete accommodation"
    );
  }

  return data;
};

export const updateAccommodation = async (
  id,
  accommodationData
) => {
  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/accommodations/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        accommodationData
      ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update accommodation"
    );
  }

  return data;
};