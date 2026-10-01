const API = "http://localhost:5000/api";

export const testBackend = async () => {
  const res = await fetch(`${API}/test`);
  const data = await res.json();
  return data.message;
};

export const signupUser = async (userData) => {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const createTrip = async (tripData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tripData),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const getTrips = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const getTripById = async (tripId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/trips/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const planTripWithAI = async (tripDetails) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/ai/plan-trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tripDetails),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const generateTripItinerary = async (tripId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/trips/${tripId}/generate-itinerary`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};