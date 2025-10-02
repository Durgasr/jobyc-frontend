import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ApplicantsPage.module.css";

export const ApplicantsPage = () => {
  const { id: jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [expandedApplicantId, setExpandedApplicantId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      const res = await axios.get(
        `https://jobyc-backend.onrender.com/api/jobyc/applications/${jobId}/applicants`,
        { withCredentials: true }
      );
      setApplicants(res.data.applicants);
      setJobDetails(res.data.jobDetails || "Loading...");
    };

    fetchApplicants();
  }, [jobId]);

  async function handleResume(applicant, applicationId) {
    await axios.get(
      `https://jobyc-backend.onrender.com/api/jobyc/applications/${applicationId}/view-resume`,
      { withCredentials: true }
    );
  }

  const toggleExpand = (id) => {
    setExpandedApplicantId(expandedApplicantId === id ? null : id);
  };

  return (
    <div className={styles.applicantsContainer}>
      <div className={styles.applicantsList}>
        <h4>
          Applicants of {jobDetails?.designation || "Loading..."} -{" "}
          {jobDetails?.companyName || "Loading..."}
        </h4>
        {applicants.length === 0 && <p>No applicants yet.</p>}
        {applicants.map((app) => (
          <div key={app._id} className={styles.applicantCard}>
            <p>
              {app.applicant.name} ({app.applicant.email})
            </p>

            <div className={styles.mobileButtons}>
              <button
                onClick={() => toggleExpand(app._id)}
              >
                {expandedApplicantId === app._id ? "Hide Profile" : "View Profile"}
              </button>

              <button>
                <a
                  href={`https://jobyc-backend.onrender.com/${app.applicant.resumeUrl}`}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent toggling
                    handleResume(app.applicant, app._id);
                  }}
                  rel="noreferrer"
                >
                  View Resume
                </a>
              </button>
            </div>

            {/* Mobile details */}
            {expandedApplicantId === app._id && (
              <div className={styles.applicantDetailsMobile}>
                <p>
                  <span>Email:</span> {app.applicant.email}
                </p>
                <p>
                  <span>Location:</span> {app.applicant.location}
                </p>
                <p>
                  <span>Skills:</span> {app.applicant.skills}
                </p>
                <p>
                  <span>Experience:</span> {app.applicant.experience}{" "}
                  {app.applicant.experience > 1 ? "Years" : "Year"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.applicantDetails}>
        {expandedApplicantId && (
          <div>
            <h3>
              {
                applicants.find((a) => a._id === expandedApplicantId)
                  ?.applicant.name
              }
            </h3>
            <p>
              <span>Email:</span>{" "}
              {
                applicants.find((a) => a._id === expandedApplicantId)
                  ?.applicant.email
              }
            </p>
            <p>
              <span>Location:</span>{" "}
              {
                applicants.find((a) => a._id === expandedApplicantId)
                  ?.applicant.location
              }
            </p>
            <p>
              <span>Skills:</span>{" "}
              {
                applicants.find((a) => a._id === expandedApplicantId)
                  ?.applicant.skills
              }
            </p>
            <p>
              <span>Experience:</span>{" "}
              {
                applicants.find((a) => a._id === expandedApplicantId)
                  ?.applicant.experience
              }{" "}
              {
                applicants.find((a) => a._id === expandedApplicantId)
                  ?.applicant.experience > 1
                  ? "Years"
                  : "Year"
              }
            </p>
          </div>
        )}
        {!expandedApplicantId && <p>Select an applicant to see details</p>}
      </div>
    </div>
  );
};
