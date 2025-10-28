import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../JobCard/JobCard";
import { Layout } from "../../components/Layout/Layout";
import { Navbar } from "../../components/Navbar/Navbar";
import styles from "./JobList.module.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/jobs",
          { withCredentials: true }
        );
        setJobs(data.jobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <Layout>
      <Navbar />
      {jobs.length === 0 ? (
        <p>No jobs right now</p>
      ) : (
        <div className={styles.jobLists}>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default JobList;
