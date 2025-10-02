import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://jobyc-backend.onrender.com/api/jobyc/user/logout",
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

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Jobyc</div>

      {user && (
        <div className={styles.profile}>
          <img
            src="/user.jpg"
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
              <button>Edit Profile</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
