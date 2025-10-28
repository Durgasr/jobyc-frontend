import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import { formatSalary } from "../../utils/formatSalary";
import styles from "./JobDetails.module.css";
import { Layout } from "../../components/Layout/Layout";
import { Navbar } from "../../components/Navbar/Navbar";

export const JobDetails = () => {
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const { user } = useContext(UserContext);
  const [job, setJob] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await axios.get(
          `https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/jobs/${jobId}`,
          { withCredentials: true }
        );
        setJob(res.data.job);
        setRecruiter(res.data.recruiter);

        // ✅ Check if already applied
        if (user?.role === "jobseeker") {
          const appliedRes = await axios.get(
            `https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/applications/check/${jobId}`,
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
      // ✅ Check profile progress before applying
      if (user.progress < 80) {
        alert(
          "Please complete your profile (minimum 80%) before applying for jobs. Click OK to update your profile."
        );
        return navigate("/profile-setup");
      }

      await axios.post(
        `https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/applications/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (!job) return <p>Loading job details...</p>;

  return (
    <Layout>
      <Navbar />
      <div className={styles.companyCard}>
        <div>
          <h2>{job.companyName}</h2>
          <p style={{ fontSize: "12px" }}>{job.location}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          {user?.role === "jobseeker" && (
            <button onClick={handleApply} disabled={applied}>
              {applied ? "Applied" : "Apply"}
            </button>
          )}
        </div>
        <p>
          <strong>Job Description</strong>
          <hr />
          {job.description}
        </p>
        <p>
          <strong>Minimum Experience Required:</strong>{" "}
          {job.minimumExperienceRequired}
        </p>
        <p>
          <strong>Skills:</strong> {job.skills.join(", ")}
        </p>
        <p>
          <strong>Salary:</strong> {formatSalary(job.salary)}
        </p>
        <p>
          <strong>Openings:</strong> {job.totalPositions}
        </p>
        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <div className={styles.recruiterSection}>
          <h4>Recruiter Details</h4>
          <hr />

          <div className={styles.recruiterInfo}>
            <img
              src={
                recruiter?.profileImage &&
                recruiter.profileImage !== "null" &&
                recruiter.profileImage !== ""
                  ? `https://jobyc-4ad8ff06194c.herokuapp.com${recruiter.profileImage}`
                  : "http://localhost:3000/user.jpg"
              }
              alt={recruiter?.name || "Recruiter"}
              className={styles.recruiterImage}
            />

            <div>
              <p>
                <strong>Name:</strong> {recruiter.name}
              </p>
              <p>
                <strong>Email:</strong> {recruiter.email}
              </p>

              {recruiter.contactNumber && (
                <p>
                  <strong>Contact Number:</strong> {recruiter.contactNumber}
                </p>
              )}
              {recruiter.company && (
                <p>
                  <strong>Company:</strong> {recruiter.company}
                </p>
              )}
              {recruiter.position && (
                <p>
                  <strong>Position:</strong> {recruiter.position}
                </p>
              )}
              {recruiter.website && (
                <p>
                  <strong>Company Website:</strong>{" "}
                  <a
                    href={recruiter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {recruiter.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
