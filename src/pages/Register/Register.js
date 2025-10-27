import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { Layout } from "../../components/Layout/Layout";

export const Register = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(UserContext);
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
    };

    try {
      const res = await axios.post(
        "https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/user/register",
        data,
        {
          withCredentials: true,
        }
      );

      alert("User registered successfully!");
      setUser(res.data.user);
      setLoading(false);

      // Redirect to profile setup page after registration
      setTimeout(() => navigate("/profile-setup"), 100);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <>
      <Layout>
        <Navbar />

        <div className={styles.registerContainer}>
          <h6 className={styles.heading}>Register as {role}</h6>
          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.roleSelector}>
            <label htmlFor="role-selector">Select Role: </label>
            <select
              value={role}
              id="role-selector"
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">--Choose Role--</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.inputField}
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className={styles.inputField}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className={styles.inputField}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button className={styles.submitBtn} type="submit">
              Register
            </button>
          </form>

          <div className={styles.loginText}>
            <p>
              Already registered? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};
