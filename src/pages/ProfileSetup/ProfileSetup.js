import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProfileSetup.module.css";
import { UserContext } from "../../context/userContext";
import { Layout } from "../../components/Layout/Layout";
import { Navbar } from "../../components/Navbar/Navbar";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [uploadStatus, setUploadStatus] = useState("");
  const [formData, setFormData] = useState({
    profileImage: null,
    title: "",
    phoneNumber: "+91",
    about: "",
    location: "",
    skills: "",
    totalExperience: 0,
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    previousSalary: "",
    resume: null,
    education: [],
    projects: [],
    portfolioLink: "",
    github: "",
    linkedin: "",
    company: "",
    position: "",
    website: "",
    companyLocation: "",
    companyDescription: "",
    companyLogo: "",
    contactNumber: "+91",
    linkedinRecruiter: "",
  });

  const [progress, setProgress] = useState(0);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/user/me", {
          withCredentials: true,
        });
        setUser(res.data.user);

        // Pre-fill form data if editing existing profile
        setFormData((prev) => ({
          ...prev,
          ...res.data.user,
          position: res.data.user.position || "",
          linkedinRecruiter: res.data.user.linkedin || "",
          resume: res.data.user.resumeUrl || null,
          totalExperience: res.data.user.totalExperience || 0,
          skills:
            Array.isArray(res.data.user.skills) &&
            res.data.user.skills.length > 0
              ? res.data.user.skills.join(", ")
              : "",
        }));
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Calculate progress dynamically
  useEffect(() => {
    if (!user) return;

    const fields =
      user.role === "jobseeker"
        ? [
            "profileImage",
            "title",
            "phoneNumber",
            "skills",
            "totalExperience",
            "experience",
            "resume",
            "location",
          ]
        : ["profileImage", "company", "position", "website", "companyLocation"];

    let filled = 0;
    fields.forEach((f) => {
      const value = formData[f];
      if (Array.isArray(value)) {
        if (
          value.some((item) =>
            Object.values(item).some((v) => v && v.toString().trim() !== "")
          )
        )
          filled++;
      } else if (value) {
        filled++;
      }
    });
    setProgress(Math.round((filled / fields.length) * 100));
  }, [formData, user]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Experience fields
  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index) => {
    const updated = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: updated });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value instanceof File) {
          // ✅ Files: append directly
          data.append(key, value);
        } else if (Array.isArray(value) || typeof value === "object") {
          // ✅ Objects/arrays: stringify
          data.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          // ✅ Plain fields: append directly
          data.append(key, value);
        }
      });

      const res = await axios.put(
        "https://jobyc-4ad8ff06194c.herokuapp.com/api/jobyc/profile/setup",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setUser(res.data.updatedUser);
      alert("Profile saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving profile");
    }
  };

  if (!user) return <p>Loading...</p>;

  const isJobseeker = user.role === "jobseeker";

  return (
    <>
      <Layout>
        <Navbar />

        <div className={styles.pfContainer}>
          {/* Header with avatar and progress */}
          <div className={styles.pfHeader}>
            <div className={styles.pfAvatarWrap}>
              <div
                className={styles.pfProgressCircle}
                style={{
                  background: `conic-gradient(#4caf50 ${
                    progress * 3.6
                  }deg, #ddd 0deg)`,
                }}
              >
                {/* <img
                  src={
                    formData.profileImage &&
                    formData.profileImage !== "null" &&
                    formData.profileImage !== ""
                      ? `https://jobyc-4ad8ff06194c.herokuapp.com${formData.profileImage}`
                      : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="Profile"
                  className={styles.pfAvatar}
                /> */}
                <img
                  src={
                    formData.profileImage instanceof File
                      ? URL.createObjectURL(formData.profileImage) // Preview newly selected file
                      : formData.profileImage // Backend URL
                      ? `https://jobyc-4ad8ff06194c.herokuapp.com${formData.profileImage}`
                      : "https://cdn-icons-png.flaticon.com/512/847/847969.png" // Fallback if empty
                  }
                  alt="Profile"
                  className={styles.pfAvatar}
                />
                <div className={styles.pfProgressText}>{progress}%</div>
              </div>
            </div>
            <h2 className={styles.pfTitle}>
              {isJobseeker
                ? "Jobseeker Profile Setup"
                : "Recruiter Profile Setup"}
            </h2>
          </div>

          {/* Form Section */}
          <form className={styles.pfForm} onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className={styles.pfRow}>
              <label>Profile Image</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFormData({
                      ...formData,
                      profileImage: e.target.files[0],
                    });
                  }
                }}
              />
            </div>

            {isJobseeker ? (
              <>
                <div className={styles.pfRow}>
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith("+91"))
                        val = "+91" + val.replace(/^\+91/, "");
                      const numericPart = val.slice(3).replace(/\D/g, "");
                      setFormData({
                        ...formData,
                        phoneNumber: "+91" + numericPart,
                      });
                    }}
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className={styles.pfRow}>
                  <label>Total Experience</label>
                  <input
                    type="number"
                    name="totalExperience"
                    value={formData.totalExperience}
                    onChange={handleChange}
                    placeholder="experience in number of years"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Experience</label>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className={styles.pfCard}>
                      <input
                        type="text"
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={exp.position}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={exp.description}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      {formData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className={`${styles.pfBtn} ${styles.small} ${styles.danger}`}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExperience}
                    className={`${styles.pfBtn} ${styles.small}`}
                  >
                    + Add Experience
                  </button>
                </div>

                <div className={styles.pfRow}>
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Current location"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Previous Salary</label>
                  <input
                    type="number"
                    name="previousSalary"
                    value={formData.previousSalary}
                    onChange={handleChange}
                    placeholder="e.g., 600000"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Upload Resume</label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFormData({ ...formData, resume: e.target.files[0] });
                      }
                    }}
                  />
                  {uploadStatus && (
                    <p className={styles.pfStatus}>{uploadStatus}</p>
                  )}

                  {/* Show uploaded or existing resume */}
                  {formData.resume && (
                    <>
                      {typeof formData.resume === "string" ? (
                        <a
                          href={`https://jobyc-4ad8ff06194c.herokuapp.com${formData.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pfResumeLink}
                        >
                          View Resume
                        </a>
                      ) : (
                        <p className={styles.pfResumeLink}>
                          {formData.resume.name}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.pfRow}>
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith("+91"))
                        val = "+91" + val.replace(/^\+91/, "");
                      const numericPart = val.slice(3).replace(/\D/g, "");
                      setFormData({
                        ...formData,
                        contactNumber: "+91" + numericPart,
                      });
                    }}
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="HR Manager / Recruiter"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Company website"
                  />
                </div>

                <div className={styles.pfRow}>
                  <label>Company Location</label>
                  <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    placeholder="Company city / address"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className={`${styles.pfBtn} ${styles.primary}`}
            >
              Save Profile
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ProfileSetup;
