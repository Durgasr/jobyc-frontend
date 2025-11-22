import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext.js";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Layout } from "../../components/Layout/Layout.js";

export const Login = () => {
  const { setUser} = useContext(UserContext);
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
    try {
      const res = await axios.post(
        "https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/user/login",
        formData,
        { withCredentials: true }
      );
      console.log(res);
      if (res.status === 200) {
        setUser(res.data.user);
        
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid email or password");
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
          <div className={styles.loginForgot}>
            <button type="submit" className={styles.formButton}>
              Login
            </button>
          </div>
          <p className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
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
