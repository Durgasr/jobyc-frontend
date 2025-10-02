import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar.js";
import styles from "./Home.module.css";

export const Home = () => {
  const navigate = useNavigate();

  const goToRegister = (role) => {
    navigate("/register", { state: { role } });
  };

  return (
    <>
      <Navbar />
      <div className={styles.home}>
        <div className={styles.left}>
          <h1 className={styles.mainHeading}>
            Your Gateway to Meaningful Careers
          </h1>
          <h2 className={styles.typingText}>
            Explore jobs, internships, and growth opportunities effortlessly.
          </h2>
          <h5 className={styles.tagline}>
            Jobyc – Get Discovered. Get Hired. Career made easy.
          </h5>

          <div className={styles.actions}>
            <button className={styles.button} onClick={() => goToRegister()}>
              Get Started
            </button>
          </div>
        </div>

        <div className={styles.right}>
          <img src="/banner.png" alt="banner" />
        </div>
      </div>
    </>
  );
};
