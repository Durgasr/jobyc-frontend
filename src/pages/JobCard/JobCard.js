import React from "react";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "../../utils/formatSalary";
import { Link } from "react-router-dom";
import styles from "./JobCard.module.css";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/jobs/${job._id}`); // Navigate to job details page
  };

  return (
    <div className={styles.jobCard}>
      <h3>{job.designation}</h3>
      <p>
        <strong>Company:</strong> {job.companyName}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Category:</strong> {job.category}
      </p>
      <p>
        <strong>Salary:</strong> {formatSalary(job.salary)}
      </p>
      <p>
        <strong>Skills:</strong> {job.skills.join(", ")}
      </p>
      <Link to={`job-details/${job._id}`}>View Details</Link>
    </div>
  );
};

export default JobCard;
