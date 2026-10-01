import { testBackend } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/Landing.css";

import logo from "../assets/logo-primary.png";
import mountains from "../assets/mountains.jpg";
import road from "../assets/road.jpg";
import backpacks from "../assets/backpacks.jpg";
import pool from "../assets/pool.jpg";
import travelFlatlay from "../assets/travel-flatlay.jpg";

function LandingPage() {
  const navigate = useNavigate();
  const checkConnection = async () => {
  try {
    const data = await testBackend();
    alert(data);
  } catch (err) {
    alert("Backend not connected.");
    console.error(err);
  }
};

  return (
    <main className="site">

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">

          <img src={logo} alt="PACKT" className="brand-logo" />

          <nav className="nav nav-left">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </nav>

<nav className="nav nav-right">
  <a href="#community">Community</a>

  <button
    className="login-btn"
    onClick={checkConnection}
  >
    Test
  </button>

  <button
    className="login-btn"
    onClick={() => navigate("/login")}
  >
    Log in
  </button>
</nav>

          <button className="mobile-menu">☰</button>

        </div>
      </header>

      {/* HERO */}
      <section className="hero">

        <img
          src={mountains}
          alt="Mountain landscape"
          className="hero-image"
        />

        <div className="hero-dark"></div>

        <div className="hero-content">

          <p className="hero-kicker">
            Plan More. Wander Often.
          </p>

          <h1>
            PLAN
            <br />
            YOUR NEXT
            <br />
            <em>ESCAPE</em>
          </h1>

          <button
            className="hero-button"
            onClick={() => navigate("/signup")}
          >
            START PLANNING
            <span>→</span>
          </button>

        </div>

      </section>

      {/* MOMENTS */}
      <section className="moments">

        <div className="moments-top">

          <h2>
            Moments &amp; Memories
          </h2>

          <div className="arrows">
            <button>←</button>
            <button>→</button>
          </div>

        </div>

        <div className="memory-grid">

          <article className="memory-card green">

            <img
              src={road}
              alt="Scenic road"
            />

            <div className="card-text">
              <h3>Weekend Escapes</h3>
              <p>Plan road trips in minutes.</p>
            </div>

          </article>

          <article className="memory-card orange">

            <img
              src={backpacks}
              alt="Backpacks"
            />

            <div className="card-text">
              <h3>Travel Together</h3>
              <p>Invite friends to one shared trip.</p>
            </div>

          </article>

          <article className="memory-card yellow">

            <img
              src={pool}
              alt="Pool"
            />

            <div className="card-text">
              <h3>Keep the Memories</h3>
              <p>Save every place and every expense.</p>
            </div>

          </article>

        </div>

      </section>

      {/* PRODUCT SECTION */}
      <section className="editorial" id="how">

        <div className="editorial-left">

          <span className="editorial-kicker">
            BUILT FOR GROUP TRAVEL
          </span>

          <h2>
            Less planning.
            <br />
            More memories.
          </h2>

          <p>
            Organise destinations, split expenses, and keep every trip in one shared space.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <span>01</span>
              <div>
                <strong>Invite Friends</strong>
                <p>Everyone joins one shared trip.</p>
              </div>
            </div>

            <div className="feature-item">
              <span>02</span>
              <div>
                <strong>Split Expenses</strong>
                <p>No awkward calculations later.</p>
              </div>
            </div>

            <div className="feature-item">
              <span>03</span>
              <div>
                <strong>Keep Everything</strong>
                <p>Places, payments and memories stay together.</p>
              </div>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default LandingPage;