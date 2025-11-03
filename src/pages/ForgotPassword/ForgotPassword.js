import React, { useState } from "react";
import axios from "axios";
import styles from "./ForgotPassword.module.css";
import { Layout } from "../../components/Layout/Layout";
import { Navbar } from "../../components/Navbar/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3700/api/jobyc/user/forgot-password",
        { email },
        { withCredentials: true }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Layout>
        <Navbar />
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Email</button>
            {message && <p className={styles.success}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ForgotPassword;
