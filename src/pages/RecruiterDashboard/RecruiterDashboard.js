import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RecruiterDashboard.module.css";
import { Navbar } from "../../components/Navbar/Navbar";
import { Layout } from "../../components/Layout/Layout";

export const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState({});
  const [recruiter, setRecruiter] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch jobs + recruiter data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.all([
          axios.get("https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/jobs/my", {
            withCredentials: true,
          }),
          axios.get("https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/user/me", {
            withCredentials: true,
          }),
        ]);

        setJobs(jobRes.data.jobs);
        setRecruiter(userRes.data.user);

        // Fetch applicant count for each job
        const countPromises = jobRes.data.jobs.map(async (job) => {
          const countRes = await axios.get(
            `https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/applications/${job._id}/count`,
            { withCredentials: true }
          );
          return [job._id, countRes.data.count];
        });

        const counts = Object.fromEntries(await Promise.all(countPromises));
        setApplicationsCount(counts);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    await axios.delete(`https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/jobs/${id}`, {
      withCredentials: true,
    });
    setJobs(jobs.filter((job) => job._id !== id));
  };

  // ✅ Handle Create Job
  const handleCreateJob = () => {
    if (!recruiter) return;

    if (recruiter.progress < 80) {
      alert(
        "Please complete your profile (minimum 80%) before posting a job. Click OK to edit your profile."
      );
      navigate("/profile-setup");
      return;
    }

    navigate("/create-job");
  };

  return (
    <Layout>
      <Navbar />
      <div className={styles.container}>
        <h4 className={styles.title}>My Job Posts</h4>

        {/* ✅ replaced Link with button for progress check */}
        <button
          onClick={handleCreateJob}
          className={styles.createLink}
          style={{ cursor: "pointer" }}
        >
          + Create New Job
        </button>

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
