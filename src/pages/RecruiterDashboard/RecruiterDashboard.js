import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RecruiterDashboard.module.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { Layout } from "../../components/Layout/Layout";

export const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get(
        "https://jobyc-backend.onrender.com/api/jobyc/jobs/my",
        {
          withCredentials: true,
        }
      );
      setJobs(res.data.jobs);

      // Fetch applicant count for each job
      const countPromises = res.data.jobs.map(async (job) => {
        const countRes = await axios.get(
          `https://jobyc-backend.onrender.com/api/jobyc/applications/${job._id}/count`,
          { withCredentials: true }
        );
        return [job._id, countRes.data.count];
      });

      const counts = Object.fromEntries(await Promise.all(countPromises));
      setApplicationsCount(counts);
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    await axios.delete(
      `https://jobyc-backend.onrender.com/api/jobyc/jobs/${id}`,
      {
        withCredentials: true,
      }
    );
    setJobs(jobs.filter((job) => job._id !== id));
  };

  return (
    <Layout>
      <Navbar />
      <div className={styles.container}>
        <h4 className={styles.title}>My Job Posts</h4>
        <Link to="/create-job" className={styles.createLink}>
          + Create New Job
        </Link>
        <div>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className={styles.jobCard}>
                <h3 className={styles.jobTitle}>{job.designation}</h3>
                <p className={styles.jobLocation}>
                  {job.companyName} - {job.location}
                </p>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
                <Link to={`/edit-job/${job._id}`} className={styles.editButton}>
                  Edit
                </Link>
                <button
                  className={`${styles.deleteButton} ${styles.applicantsButton}`}
                  onClick={() => navigate(`/job/${job._id}/applicants`)}
                >
                  Applicants ({applicationsCount[job._id] || 0})
                </button>
              </div>
            ))
          ) : (
            <p className={styles.noJobs}>No job posts found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};
