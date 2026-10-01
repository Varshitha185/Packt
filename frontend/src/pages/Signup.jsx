import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";
import "../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
      const res = await signupUser(form);

      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Start Your Journey</h1>
<p>Create your PACKT account and begin planning unforgettable trips.</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;