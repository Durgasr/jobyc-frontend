import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

export const PrivateRoute = ({ children, role }) => {
  const { user, setUser, loading, setLoading } = useContext(UserContext);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!user) {
        try {
          const res = await axios.get("https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/user/me", {
            withCredentials: true,
          });
          setUser(res.data.user);
        } catch (err) {
          console.error("User verification failed:", err);
        }
      }
      setChecking(false);
      setLoading(false);
    };

    verifyUser();
  }, [user, setUser, setLoading]);

  if (checking || loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // role can be an array (e.g. ["jobseeker", "recruiter"])
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : role.split(",").map(r => r.trim());
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
