import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateTripModal from "../components/CreateTripModal";
import { getTrips } from "../services/api";
import AIPlannerModal from "../components/AIPlannerModal";
import { getDestinationImage } from "../services/imageService";
import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [showAI, setShowAI] = useState(false);

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};
  const user = JSON.parse(localStorage.getItem("user"));

  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState({});

const loadTrips = async () => {
  try {
    const data = await getTrips();
    setTrips(data);

    const imageMap = {};

    for (const trip of data) {
      imageMap[trip.destination] = await getDestinationImage(
        trip.destination
      );
    }

    setImages(imageMap);
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <main className="dashboard">

      <div className="dashboard-top">

        <div>
          <h1>
            Welcome, {user?.name}
          </h1>

          <p>
            Your next adventure starts here.
          </p>
        </div>

<div className="dashboard-actions">
  <button
    className="logout-btn"
    onClick={logout}
  >
    Log Out
  </button>

  <button
    className="ai-btn"
    onClick={() => setShowAI(true)}
  >
    AI Plan
  </button>

  <button
    className="new-trip-btn"
    onClick={() => setShowModal(true)}
  >
    + New Trip
  </button>
</div>

      </div>

      <div className="trip-grid">

        {trips.length === 0 ? (
          <div className="empty-state">
            <h3>No trips yet</h3>
            <p>Create your first trip.</p>
          </div>
        ) : (
          trips.map((trip) => (
            <article
  key={trip._id}
  className="trip-card"
  onClick={() => navigate(`/trips/${trip._id}`)}
>

  <img
    src={images[trip.destination]}
    alt={trip.destination}
    className="trip-image"
  />

  <div className="trip-content">

    <span className="location-badge">
      📍 {trip.destination}
    </span>

    <h3>{trip.name}</h3>

    <small>
      {new Date(trip.startDate).toLocaleDateString()}
      {" — "}
      {new Date(trip.endDate).toLocaleDateString()}
    </small>

    <div className="member-bubbles">
      {trip.members.slice(0,3).map((member,index)=>(
        <span key={index}>
          {member.name.charAt(0).toUpperCase()}
        </span>
      ))}

      {trip.members.length>3 && (
        <span>+{trip.members.length-3}</span>
      )}
    </div>

  </div>

</article>
          ))
        )}

      </div>

      <CreateTripModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onTripCreated={loadTrips}
      />

      <AIPlannerModal
  open={showAI}
  onClose={() => setShowAI(false)}
/>

    </main>
  );
}

export default Dashboard;