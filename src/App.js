import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import CreateJob from "./pages/CreateJob/CreateJob";
import { RecruiterDashboard } from "./pages/RecruiterDashboard/RecruiterDashboard";
import EditJob from "./pages/EditJob/EditJob";
import JobList from "./pages/JobList/JobList";
import { JobDetails } from "./pages/JobDetails/JobDetails";
import { ApplicantsPage } from "./pages/ApplicantsPage/ApplicantsPage";
import { PrivateRoute } from "./routes/PrivateRoute";
import { AuthRoute } from "./routes/AuthRoute";
import ProfileSetup from "./pages/ProfileSetup/ProfileSetup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRoute>
            <Home />
          </AuthRoute>
        }
      />
       <Route
        path="/forgot-password"
        element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        }
      />
       <Route
        path="/reset-password/:token"
        element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        }
      />

      {/* Login / Register routes */}
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />

      {/* Jobseeker routes */}
      <Route
        path="/jobs"
        element={
          <PrivateRoute role="jobseeker">
            <JobList />
          </PrivateRoute>
        }
      />
      <Route
        path="/jobs/job-details/:id"
        element={
          <PrivateRoute role="jobseeker">
            <JobDetails />
          </PrivateRoute>
        }
      />

      {/* Recruiter routes */}
      <Route
        path="/profile-setup"
        element={
          <PrivateRoute role={["jobseeker", "recruiter"]}>
            <ProfileSetup />
          </PrivateRoute>
        }
      />

      <Route
        path="/create-job"
        element={
          <PrivateRoute role="recruiter">
            <CreateJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute role="recruiter">
            <RecruiterDashboard />
          </PrivateRoute>
        }
      />

      <Route path="/edit-job/:id" element={<EditJob />} />
      <Route path="/job/:id/applicants" element={<ApplicantsPage />} />
    </Routes>
  );
}

export default App;
