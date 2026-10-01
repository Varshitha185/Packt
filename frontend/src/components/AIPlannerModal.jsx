import { useState } from "react";
import { planTripWithAI } from "../services/api";

const formatItinerary = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^###\s*/gm, "")
    .replace(/^##\s*/gm, "")
    .replace(/^#\s*/gm, "")
    .replace(/^---$/gm, "")
    .replace(/^- /gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

function AIPlannerModal({ open, onClose }) {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    budget: "",
    people: "",
    vibe: "",
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await planTripWithAI({
        destination: form.destination,
        days: Number(form.days),
        budget: form.budget,
        people: Number(form.people),
        vibe: form.vibe,
      });

      setItinerary(res.itinerary);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setItinerary("");

    setForm({
      destination: "",
      days: "",
      budget: "",
      people: "",
      vibe: "",
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="trip-modal">
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>

        {!itinerary ? (
          <>
            <span className="planner-kicker">AI TRAVEL PLANNER</span>

            <h2>Plan your next escape.</h2>

            <p className="planner-subtext">
              Tell Scout your travel style and we'll build a personalized trip.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                name="destination"
                placeholder="Destination"
                value={form.destination}
                onChange={handleChange}
                required
              />

              <div className="destination-chips">
  {["Goa","Manali","Coorg","Ooty","Bali"].map((place)=>(
    <button
      key={place}
      type="button"
      onClick={()=>setForm({...form,destination:place})}
    >
      {place}
    </button>
  ))}
</div>

              <div className="planner-row">
                <input
                  type="number"
                  name="days"
                  placeholder="Days"
                  value={form.days}
                  onChange={handleChange}
                  min="1"
                  required
                />

                <input
                  type="number"
                  name="people"
                  placeholder="Travelers"
                  value={form.people}
                  onChange={handleChange}
                  min="1"
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
                placeholder="Your vibe (relaxing, adventurous, cafés, beaches...)"
                value={form.vibe}
                onChange={handleChange}
                rows="3"
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Planning..." : "Generate Itinerary"}
              </button>
            </form>
          </>
        ) : (
          <div className="ai-result">
            <span className="planner-kicker">YOUR TRAVEL GUIDE</span>

            <h2>Your itinerary</h2>

            <div className="itinerary-box">
              {formatItinerary(itinerary)
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </div>

            <button onClick={handleClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIPlannerModal;