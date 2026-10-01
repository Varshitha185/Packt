import { useState } from "react";
import { createTrip } from "../services/api";

function CreateTripModal({ open, onClose, onTripCreated }) {
  const [form, setForm] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    members: "",
    budget: "",
    vibe: "",
  });

  if (!open) return null;

  const resetForm = () => {
    setForm({
      name: "",
      destination: "",
      startDate: "",
      endDate: "",
      members: "",
      budget: "",
      vibe: "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tripData = {
        name: form.name,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget,
        vibe: form.vibe,
        members: form.members
          .split(",")
          .filter((name) => name.trim())
          .map((name) => ({
            name: name.trim(),
          })),
      };

      await createTrip(tripData);

      onTripCreated();
      handleClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="trip-modal create-trip-modal">

        <button className="close-btn" onClick={handleClose}>
          ×
        </button>

        <span className="planner-kicker">NEW TRIP</span>

        <h2>Create your postcard.</h2>

        <p className="planner-subtext">
          Start a shared trip and Scout will build your itinerary automatically.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Trip name (Goa Escape)"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="destination"
            placeholder="Destination"
            value={form.destination}
            onChange={handleChange}
            required
          />

          <div className="planner-row">

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />

          </div>

          <input
            name="budget"
            placeholder="Total Budget (₹)"
            value={form.budget}
            onChange={handleChange}
            required
          />

          <textarea
            name="vibe"
            placeholder="Your vibe (cafés, beaches, adventure...)"
            value={form.vibe}
            onChange={handleChange}
            rows="3"
          />

          <input
            name="members"
            placeholder="Friends (Alex, Maya, Sam...)"
            value={form.members}
            onChange={handleChange}
          />

          <button type="submit">
            Create Trip
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreateTripModal;