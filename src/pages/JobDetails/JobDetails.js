import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { formatSalary } from "../../utils/formatSalary";
import styles from "./JobDetails.module.css";
import { Layout } from "../../components/Layout/Layout";
import { Navbar } from "../../components/Navbar/Navbar";

export const JobDetails = () => {
  const { id: jobId } = useParams();
  const { user } = useContext(UserContext);
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(
          `https://jobyc-backend.onrender.com/api/jobyc/jobs/${jobId}`,
          { withCredentials: true }
        );
        setJob(res.data.job);

        // ✅ Check if already applied
        if (user?.role === "jobseeker") {
          const appliedRes = await axios.get(
            `https://jobyc-backend.onrender.com/api/jobyc/applications/check/${jobId}`,
            { withCredentials: true }
          );
          setApplied(appliedRes.data.applied);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobDetails();
  }, [jobId, user]);

  const handleApply = async () => {
    try {
      await axios.post(
        `https://jobyc-backend.onrender.com/api/jobyc/applications/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <Layout>
      <Navbar />
      <div className={styles.companyCard}>
        <h2>{job.companyName}</h2>
        <div className={styles.aboutSection}>
          <h4>About {job.companyName}</h4>
          <hr />
          <p>{job.description}</p>
        </div>
        <p>
          <strong>Location:</strong> {job.location}
        </p>
        <p>
          <strong>Salary:</strong> {formatSalary(job.salary)}
        </p>
        <p>
          <strong>Skills:</strong> {job.skills.join(", ")}
        </p>

        {user?.role === "jobseeker" && (
          <button onClick={handleApply} disabled={applied}>
            {applied ? "Applied" : "Apply"}
          </button>
        )}
      </div>
    </Layout>
  );
};
