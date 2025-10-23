import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userImg, setUserImg] = useState("./user.jpg");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);

    if (user && user.profileImage) {
      setUserImg(`http://localhost:3700${user.profileImage}`);
    } else {
      setUserImg("./user.jpg");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3700/api/jobyc/user/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      setDropdownOpen(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // console.log(userImg);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <img src="/jobyc.png" className={styles.jobycLogo} alt="logo" />
        <p>Joby Careers</p>
      </div>

      {user && (
        <div className={styles.profile}>
          <img
            src={userImg}
            alt="Profile"
            className={styles.profilePic}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          <span className={styles.username}>{user.name}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              <button>
                {" "}
                <Link to="/profile-setup">Edit Profile</Link>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
