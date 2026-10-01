import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTripById,
  generateTripItinerary,
} from "../services/api";
import { getDestinationImage } from "../services/imageService";
import "../styles/TripDetails.css";

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const data = await getTripById(id);
        setTrip(data);

        const destinationImage = await getDestinationImage(
          data.destination
        );

        setImage(destinationImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const handleGenerateItinerary = async () => {
  try {
    setGenerating(true);

    const data = await generateTripItinerary(id);

    setTrip((currentTrip) => ({
      ...currentTrip,
      aiItinerary: data.itinerary,
    }));
  } catch (err) {
    alert(err.message);
  } finally {
    setGenerating(false);
  }
};

  if (loading) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-loading">
          Loading your trip...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="trip-details-page">
        <div className="trip-details-error">
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")}>
            Back to trips
          </button>
        </div>
      </main>
    );
  }

  if (!trip) {
    return null;
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  const tripDays =
    Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    ) + 1;

  return (
    <main className="trip-details-page">

      <div className="trip-details-container">

        <button
          className="back-to-trips"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to trips
        </button>

        <section className="trip-hero">

          <div className="trip-hero-image">
            {image && (
              <img
                src={image}
                alt={trip.destination}
              />
            )}
          </div>

          <div className="trip-hero-content">

            <span className="trip-location">
              {trip.destination}
            </span>

            <h1>{trip.name}</h1>

            <p className="trip-dates">
              {startDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {" — "}
              {endDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

          </div>

        </section>

        <section className="trip-overview">

          <div className="overview-item">
            <span>TRAVELERS</span>
            <strong>{trip.members.length}</strong>
          </div>

          <div className="overview-item">
            <span>BUDGET</span>
            <strong>₹{trip.budget}</strong>
          </div>

          <div className="overview-item">
            <span>DURATION</span>
            <strong>{tripDays} days</strong>
          </div>

        </section>

        <section className="trip-info-grid">

          <div className="trip-info-card">
            <span className="section-label">YOUR TRAVEL STYLE</span>

            <p>
              {trip.vibe || "No preferences added yet."}
            </p>
          </div>

          <div className="trip-info-card">
            <span className="section-label">TRAVELERS</span>

            <div className="traveler-list">
              {trip.members.map((member, index) => (
                <div className="traveler" key={index}>
                  <span className="traveler-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </span>

                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

<section className="itinerary-section">

  <div className="itinerary-heading">
    <div>
      <span className="section-label">
        YOUR ITINERARY
      </span>

      <h2>Let Scout plan the journey.</h2>

      <p>
        Your trip details are ready. Scout can turn them
        into a day-by-day travel plan.
      </p>
    </div>

    <button
      className="scout-button"
      onClick={handleGenerateItinerary}
      disabled={generating}
    >
      {generating ? "Scout is planning..." : "Plan with Scout"}
    </button>
  </div>

  {trip.aiItinerary ? (
    <div className="itinerary-result">

      <div className="itinerary-view-toggle">
        <button
          className={!showFullItinerary ? "active" : ""}
          onClick={() => setShowFullItinerary(false)}
        >
          Quick View
        </button>

        <button
          className={showFullItinerary ? "active" : ""}
          onClick={() => setShowFullItinerary(true)}
        >
          Full Itinerary
        </button>
      </div>

      {showFullItinerary ? (
        <div className="full-itinerary">
          {trip.aiItinerary
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line, index) => (
              <p key={index}>{line}</p>
            ))}
        </div>
      ) : (
        <div className="quick-itinerary">

          {trip.aiItinerary
            .split("\n")
            .filter((line) => {
              const text = line.trim().toLowerCase();

              return (
                text.startsWith("day ") ||
                /^\d{1,2}(:\d{2})?\s*(am|pm)/i.test(line.trim())
              );
            })
            .map((line, index) => (
              <p key={index}>{line}</p>
            ))}

          <div className="quick-itinerary-note">
            <p>
              This is a quick overview of your trip.
            </p>

            <button
              onClick={() => setShowFullItinerary(true)}
            >
              View full itinerary →
            </button>
          </div>

        </div>
      )}

    </div>
  ) : (
    <div className="itinerary-empty">

      <span className="empty-number">01</span>

      <div>
        <h3>Your itinerary will appear here.</h3>

        <p>
          Places to explore, food to try, and things to
          experience — all organised around your trip.
        </p>
      </div>

    </div>
  )}

</section>

      </div>

    </main>
  );
}

export default TripDetails;