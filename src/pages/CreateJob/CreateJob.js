import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CreateJob.module.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { Layout } from "../../components/Layout/Layout";
import { Link } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    category: "",
    designation: "",
    description: "",
    location: "",
    salary: "",
    totalPositions: "",
    skills: "",
    applyBy: "",
  });

  const categories = ["Tech", "Non Tech"];
  const designations = [
    "HR",
    "SDE",
    "DevOps",
    "MERN Developer",
    "MEAN Developer",
    "Front-End Developer",
    "Back-End Developer",
    "Full-Stack Developer",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        totalPositions: Number(formData.totalPositions),
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim())
          : [],
      };

      await axios.post(
        "https://jobyc-backend.onrender.com/api/jobyc/jobs",
        payload,
        {
          withCredentials: true,
        }
      );

      alert("Job posted successfully!");
      navigate("/dashboard"); // recruiter dashboard
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create job post");
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Create Job Post</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className={styles.input}
          >
            <option value="">Select Designation</option>
            {designations.map((des) => (
              <option key={des} value={des}>
                {des}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
            className={`${styles.input} ${styles.textarea}`}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="number"
            name="salary"
            placeholder="Enter CTC"
            value={formData.salary}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="number"
            name="totalPositions"
            placeholder="Total Positions"
            value={formData.totalPositions}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            required
            className={styles.input}
          />

          <input
            type="date"
            name="applyBy"
            value={formData.applyBy}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <div>
            <button type="submit" className={styles.button}>
              Create Job
            </button>
            <Link to="/dashboard" className={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateJob;
