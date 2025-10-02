import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/userContext.js";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Layout } from "../../components/Layout/Layout.js";

export const Login = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://jobyc-backend.onrender.com/api/jobyc/user/login",
        formData,
        { withCredentials: true } // important to send/receive cookie
      );

      setUser(res.data.user); // update context with logged-in user
      setLoading(false);

      // Redirect based on role
      if (res.data.user.role === "jobseeker") navigate("/jobs");
      else if (res.data.user.role === "recruiter") navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response.data.error);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Login</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
          <button type="submit" className={styles.formButton}>
            Login
          </button>
        </form>
        <div className={styles.loginFooter}>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};
