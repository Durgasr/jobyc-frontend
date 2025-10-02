import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { Layout } from "../../components/Layout/Layout";

export const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, setLoading } = useContext(UserContext);
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    resume: null, // <-- file stored here
    experience: "",
    location: "",
    company: "",
    position: "",
    website: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] }); // store file object
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("role", role);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (role === "jobseeker") {
      data.append(
        "skills",
        formData.skills ? formData.skills.split(",").map((s) => s.trim()) : []
      );
      if (formData.resume) data.append("resume", formData.resume);
      data.append("experience", formData.experience);
      data.append("location", formData.location);
    }

    if (role === "recruiter") {
      data.append("company", formData.company);
      data.append("position", formData.position);
      data.append("website", formData.website);
    }

    try {
      const res = await axios.post(
        "https://jobyc-backend.onrender.com/api/jobyc/user/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      alert("User registered successfully!");
      setUser(res.data.user);
      setLoading(false);

      if (res.data.user.role === "jobseeker") navigate("/jobs");
      else if (res.data.user.role === "recruiter") navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response.data.error);
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
            <label for="role-selector">Select Role: </label>
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

            {role === "jobseeker" && (
              <>
                <input
                  className={styles.inputField}
                  type="text"
                  name="skills"
                  placeholder="Skills (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <input
                  className={styles.inputField}
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                />
                <input
                  className={styles.inputField}
                  type="Number"
                  name="experience"
                  placeholder="Experience in years"
                  value={formData.experience}
                  onChange={handleChange}
                />
                <input
                  className={styles.inputField}
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </>
            )}

            {role === "recruiter" && (
              <>
                <input
                  className={styles.inputField}
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                />
                <input
                  className={styles.inputField}
                  type="text"
                  name="position"
                  placeholder="Position"
                  value={formData.position}
                  onChange={handleChange}
                />
                <input
                  className={styles.inputField}
                  type="text"
                  name="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </>
            )}

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
