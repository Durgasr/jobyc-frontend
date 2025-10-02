import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const AuthRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (user) {
    if (user.role === "jobseeker") return <Navigate to="/jobs" replace />;
    if (user.role === "recruiter") return <Navigate to="/dashboard" replace />;
  }

  return children;
};
