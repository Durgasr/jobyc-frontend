import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../../components/Navbar/Navbar";
import { Layout } from "../../components/Layout/Layout";
import { Link } from "react-router-dom";
import styles from "./EditJob.module.css";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    category: "Tech",
    designation: "HR",
    description: "",
    location: "",
    salary: 0,
    totalPositions: 1,
    skills: "",
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJob = async () => {
      try {
        const { data } = await axios.get(
          `https://jobyc-backend.onrender.com/api/jobyc/jobs/${id}`,
          { withCredentials: true }
        );

        // Convert skills array to comma-separated string
        const skillsString = Array.isArray(data.job.skills)
          ? data.job.skills.join(", ")
          : data.job.skills || "";

        setFormData({
          companyName: data.job.companyName || "",
          description: data.job.description || "",
          category: data.job.category || "Tech",
          designation: data.job.designation || "HR",
          location: data.job.location || "",
          salary: data.job.salary || 0,
          totalPositions: data.job.totalPositions || 1,
          skills: skillsString,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setLoading(false);
      }
    };

    if (id) fetchJob();

    return () => {
      controller.abort();
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()), // string → array
      };

      await axios.put(
        `https://jobyc-backend.onrender.com/api/jobyc/jobs/${id}`,
        jobData,
        {
          withCredentials: true,
        }
      );

      alert("Job updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating job:", err);
      alert("Failed to update job");
    }
  };

  if (loading) return <p>Loading job details...</p>;

  return (
    <Layout>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Job</h2>
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
              Update Job
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

export default EditJob;
