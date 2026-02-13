import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { FaCog, FaPlus, FaTrash, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from "react-icons/fa";

const Template9 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData } = useResume();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(() => ({
    ...resumeData,
    skills: resumeData?.skills || [],
    experience: resumeData?.experience || [],
    achievements: resumeData?.achievements || [],
    education: resumeData?.education || [],
    certifications: resumeData?.certifications || [],
    languages: resumeData?.languages || [],
    projects: resumeData?.projects || [],
  }));
  const [activeSection, setActiveSection] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    designation: true,
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    achievements: true,
    education: true,
    courses: true,
    languages: true,
    projects: true,
  });
  const settingsRef = useRef(null);

  useEffect(() => {
    setLocalData({
      ...resumeData,
      skills: resumeData?.skills || [],
      experience: resumeData?.experience || [],
      achievements: resumeData?.achievements || [],
      education: resumeData?.education || [],
      certifications: resumeData?.certifications || [],
      languages: resumeData?.languages || [],
      projects: resumeData?.projects || [],
    });
  }, [resumeData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    localStorage.setItem('resumeData', JSON.stringify(updatedData));
  };

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...(localData[section] || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [key]: value };
      const updatedData = { ...localData, [section]: updated };
      setLocalData(updatedData);
      localStorage.setItem('resumeData', JSON.stringify(updatedData));
    }
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
    setActiveSection(null);
  };

  const handleCancel = () => {
    setLocalData(resumeData);
    setEditMode(false);
    setActiveSection(null);
  };

  const handleEnhance = (section) => {
<<<<<<< HEAD
    // Enhancement logic here
=======

>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
  };

  const extractEmailFromContact = (contact) => {
    const emailMatch = contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : "example@gmail.com";
  };

  const handleToggleField = (field) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const addSkill = () => {
    setLocalData({ ...localData, skills: [...(localData.skills || []), "New Skill"] });
  };

  const removeSkill = (index) => {
    const updatedSkills = (localData.skills || []).filter((_, i) => i !== index);
    setLocalData({ ...localData, skills: updatedSkills });
  };

  const addExperience = () => {
    setLocalData({
      ...localData,
      experience: [
        ...(localData.experience || []),
        {
          title: "New Position",
          companyName: "New Company",
          date: "MM/YYYY - MM/YYYY",
          companyLocation: "Location",
          accomplishment: ["New accomplishment"]
        },
      ],
    });
  };

  const removeExperience = (index) => {
    setLocalData({
      ...localData,
      experience: (localData.experience || []).filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    setLocalData({
      ...localData,
      achievements: [...(localData.achievements || []), "New Achievement"],
    });
  };

  const removeAchievement = (index) => {
    setLocalData({
      ...localData,
      achievements: (localData.achievements || []).filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setLocalData({
      ...localData,
      education: [
        ...(localData.education || []),
        { degree: "New Degree", duration: "MM/YYYY - MM/YYYY", institution: "New School", location: "Location" },
      ],
    });
  };

  const removeEducation = (index) => {
    setLocalData({
      ...localData,
      education: (localData.education || []).filter((_, i) => i !== index),
    });
  };

  const addCourse = () => {
    setLocalData({
      ...localData,
      certifications: [
        ...(localData.certifications || []),
        { title: "New Course", issuer: "Issuer", date: "MM/YYYY" },
      ],
    });
  };

  const removeCourse = (index) => {
    setLocalData({
      ...localData,
      certifications: (localData.certifications || []).filter((_, i) => i !== index),
    });
  };

  const addLanguage = () => {
    setLocalData({ ...localData, languages: [...(localData.languages || []), "New Language"] });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = (localData.languages || []).filter((_, i) => i !== index);
    setLocalData({ ...localData, languages: updatedLanguages });
  };

  const addProject = () => {
    setLocalData({
      ...localData,
      projects: [
        ...(localData.projects || []),
        {
          name: "New Project",
          description: "Description here",
          technologies: ["Tech1", "Tech2"],
          link: "https://example.com",
          github: "https://github.com/example"
        },
      ],
    });
  };

  const removeProject = (index) => {
    setLocalData({
      ...localData,
      projects: (localData.projects || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar onEnhance={handleEnhance} resumeRef={resumeRef} />

<<<<<<< HEAD
        {/* Main Content */}
        <div className="main-content" style={{ flex: 1, padding: "2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Settings Button */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "0.5rem",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
            >
              <FaCog size={20} />
            </button>
=======
        <div style={{
          flexGrow: 1,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          transition: "margin-left 0.3s ease-in-out"
        }}>
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "#fff",
              color: "#111827",
              maxWidth: "1000px",
              width: "100%",
              padding: "2rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "0.5rem",
              position: "relative"
            }}
            onClick={() => {
              setActiveSection(null);
              setShowSettings(false);
            }}
          >
            {/* Settings Toggle */}
            {activeSection === "name" && (
              <FaCog
                style={{
                  position: "absolute",
                  top: "2.5rem",
                  right: "2.5rem",
                  cursor: "pointer",
                  color: "#6b7280",
                  fontSize: "1.25rem"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
              />
            )}
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf

            {/* Settings Panel */}
            {showSettings && (
              <div
                ref={settingsRef}
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 10,
                  minWidth: "200px"
                }}
              >
<<<<<<< HEAD
                <h4 style={{ marginBottom: "0.75rem", fontWeight: "600" }}>Toggle Sections</h4>
                {Object.keys(visibleFields).map((field) => (
                  <div key={field} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={visibleFields[field]}
                      onChange={() => handleToggleField(field)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <label style={{ textTransform: "capitalize" }}>{field}</label>
=======
                {["name", "designation", "contact", "summary", "skills", "experience", "achievements", "education", "courses", "languages", "projects"].map((field) => (
                  <div key={field} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                      Show {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <label style={{ position: "relative", display: "inline-block", width: "2.5rem", height: "1.25rem" }}>
                      <input
                        type="checkbox"
                        checked={visibleFields[field]}
                        onChange={() => handleToggleField(field)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: "9999px",
                          transition: "0.4s",
                          backgroundColor: visibleFields[field] ? "#3b82f6" : "#d1d5db"
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "0.125rem",
                            top: "0.125rem",
                            backgroundColor: "#fff",
                            width: "0.875rem",
                            height: "0.875rem",
                            borderRadius: "50%",
                            transition: "0.4s",
                            transform: visibleFields[field] ? "translateX(1.25rem)" : "translateX(0)"
                          }}
                        />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Header */}
            <div
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", textAlign: "left", paddingBottom: "1.5rem" }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection("name");
              }}
            >
              <div>
                {visibleFields.name && (
                  editMode ? (
                    <input
                      type="text"
                      value={localData.name || ""}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      style={{
                        fontSize: "1.875rem",
                        fontWeight: "bold",
                        display: "block",
                        border: "1px solid #d1d5db",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        width: "100%"
                      }}
                    />
                  ) : (
                    <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", margin: 0 }}>{resumeData.name}</h1>
                  )
                )}
                {visibleFields.designation && (
                  editMode ? (
                    <input
                      type="text"
                      value={localData.role || ""}
                      onChange={(e) => handleFieldChange("role", e.target.value)}
                      style={{
                        fontSize: "1.125rem",
                        color: "#6b7280",
                        border: "1px solid #d1d5db",
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        marginTop: "0.5rem",
                        width: "100%"
                      }}
                    />
                  ) : (
                    <h2 style={{ fontSize: "1.125rem", color: "#6b7280", margin: "0.5rem 0 0 0" }}>{resumeData.role}</h2>
                  )
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                {visibleFields.contact && (
                  editMode ? (
                    <div>
                      <input
                        type="text"
                        value={localData.phone || ""}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        placeholder="Phone"
                        style={{
                          display: "block",
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                      <input
                        type="text"
                        value={localData.email || ""}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        placeholder="Email"
                        style={{
                          display: "block",
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                      <input
                        type="text"
                        value={localData.location || ""}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        placeholder="Location"
                        style={{
                          display: "block",
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                      <input
                        type="text"
                        value={localData.linkedin || ""}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        placeholder="LinkedIn"
                        style={{
                          display: "block",
                          marginBottom: "0.25rem",
                          border: "1px solid #d1d5db",
                          padding: "0.25rem",
                          borderRadius: "0.25rem"
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      {resumeData.phone && <p style={{ margin: "0.125rem 0" }}>{resumeData.phone}</p>}
                      {resumeData.email && <div style={{ margin: "0.125rem 0" }}><a href={`mailto:${resumeData.email}`} style={{ textDecoration: "none", color: "inherit" }}>{resumeData.email}</a></div>}
                      {resumeData.location && <p style={{ margin: "0.125rem 0" }}>{resumeData.location}</p>}
                      {resumeData.linkedin && <div style={{ margin: "0.125rem 0" }}><a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>Linked In</a></div>}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Summary */}
            {visibleFields.summary && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("profile");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Profile
                </h3>
                {editMode ? (
                  <textarea
                    value={localData.summary || ""}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: "4rem",
                      border: "1px solid #d1d5db",
                      padding: "0.5rem",
                      borderRadius: "0.25rem",
                      color: "#374151"
                    }}
                  />
                ) : (
                  <div style={{ color: "#374151", marginTop: "0.5rem" }}>
                    {resumeData.summary}
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            {visibleFields.skills && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("skills");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Key Skills
                </h3>
                <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {(localData.skills || []).map((skill, index) => (
                    <li key={index} style={{ marginBottom: "0.25rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={skill || ""}
                          onChange={(e) => {
                            const updatedSkills = [...(localData.skills || [])];
                            updatedSkills[index] = e.target.value;
                            setLocalData({ ...localData, skills: updatedSkills });
                          }}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      ) : (
                        skill
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && activeSection === "skills" && (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        backgroundColor: "#16a34a",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={addSkill}
                    >
                      <FaPlus /> New Skill
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => removeSkill((localData.skills || []).length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Experience */}
            {visibleFields.experience && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("experience");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Work Experience
                </h3>
                {(localData.experience || []).map((exp, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={exp.title || ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "title", e.target.value)}
                          placeholder="Job Title"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={exp.companyName || ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "companyName", e.target.value)}
                          placeholder="Company Name"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={exp.date || ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "date", e.target.value)}
                          placeholder="Duration"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={exp.companyLocation || ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "companyLocation", e.target.value)}
                          placeholder="Location"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <textarea
                          value={exp.accomplishment ? exp.accomplishment.join("\n") : ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "accomplishment", e.target.value.split("\n"))}
                          placeholder="Accomplishments (one per line)"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            minHeight: "3rem"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{exp.title}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{exp.companyName}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          {exp.date} - {exp.companyLocation}
                        </div>
                        <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                          {exp.accomplishment && exp.accomplishment.map((acc, accIndex) => (
                            <li key={accIndex} style={{ marginBottom: "0.25rem" }}>{acc}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {editMode && activeSection === "experience" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addExperience}
                        >
                          <FaPlus /> New Experience
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeExperience(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Achievements */}
            {visibleFields.achievements && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("achievements");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Achievements
                </h3>
                <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {(localData.achievements || []).map((achievement, index) => (
                    <li key={index} style={{ marginBottom: "0.25rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={achievement || ""}
                          onChange={(e) => {
                            const updated = [...(localData.achievements || [])];
                            updated[index] = e.target.value;
                            setLocalData({ ...localData, achievements: updated });
                          }}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      ) : (
                        achievement
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && activeSection === "achievements" && (
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "9999px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                      }}
                      onClick={addAchievement}
                    >
                      <FaPlus /> New Achievement
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => removeAchievement((localData.achievements || []).length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Education */}
            {visibleFields.education && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("education");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Education
                </h3>
                {(localData.education || []).map((edu, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => handleArrayFieldChange("education", index, "degree", e.target.value)}
                          placeholder="Degree"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={edu.institution || ""}
                          onChange={(e) => handleArrayFieldChange("education", index, "institution", e.target.value)}
                          placeholder="Institution"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={edu.duration || ""}
                          onChange={(e) => handleArrayFieldChange("education", index, "duration", e.target.value)}
                          placeholder="Duration"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={edu.location || ""}
                          onChange={(e) => handleArrayFieldChange("education", index, "location", e.target.value)}
                          placeholder="Location"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{edu.degree}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{edu.institution}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          {edu.duration} - {edu.location}
                        </div>
                      </>
                    )}
                    {editMode && activeSection === "education" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addEducation}
                        >
                          <FaPlus /> New Education
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeEducation(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications/Courses */}
            {visibleFields.courses && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("courses");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Courses
                </h3>
                {(localData.certifications || []).map((course, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={course.title || ""}
                          onChange={(e) => handleArrayFieldChange("certifications", index, "title", e.target.value)}
                          placeholder="Course Title"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={course.issuer || ""}
                          onChange={(e) => handleArrayFieldChange("certifications", index, "issuer", e.target.value)}
                          placeholder="Issued By"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={course.date || ""}
                          onChange={(e) => handleArrayFieldChange("certifications", index, "date", e.target.value)}
                          placeholder="Date"
                          style={{
                            color: "#374151",
                            fontSize: "0.875rem",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{course.title}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{course.issuer}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          {course.date}
                        </div>
                      </>
                    )}
                    {editMode && activeSection === "courses" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addCourse}
                        >
                          <FaPlus /> New Course
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeCourse(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {visibleFields.languages && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("languages");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Languages
                </h3>
                <ul style={{ color: "#374151", marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {(localData.languages || []).map((language, index) => (
                    <li key={index} style={{ marginBottom: "0.25rem" }}>
                      {editMode ? (
                        <input
                          type="text"
                          value={language || ""}
                          onChange={(e) => {
                            const updatedLanguages = [...(localData.languages || [])];
                            updatedLanguages[index] = e.target.value;
                            setLocalData({ ...localData, languages: updatedLanguages });
                          }}
                          style={{
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      ) : (
                        language
                      )}
                    </li>
                  ))}
                </ul>
                {editMode && activeSection === "languages" && (
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#16a34a",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={addLanguage}
                    >
                      <FaPlus /> New Language
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}
                      onClick={() => removeLanguage((localData.languages || []).length - 1)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Projects */}
            {visibleFields.projects && (
              <div
                style={{ marginBottom: "1.5rem" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSection("projects");
                }}
              >
                <h3 style={{ fontWeight: "bold", fontSize: "1.125rem", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "0.5rem", margin: "0 0 0.5rem 0" }}>
                  Projects
                </h3>
                {(localData.projects || []).map((project, index) => (
                  <div key={index} style={{ padding: "1rem", marginBottom: "1rem", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", borderRadius: "0.5rem" }}>
                    {editMode ? (
                      <>
                        <input
                          type="text"
                          value={project.name || ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "name", e.target.value)}
                          placeholder="Project Name"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <textarea
                          value={project.description || ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "description", e.target.value)}
                          placeholder="Project Description"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            minHeight: "3rem",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.technologies ? project.technologies.join(", ") : ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "technologies", e.target.value.split(",").map(t => t.trim()))}
                          placeholder="Technologies (comma separated)"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.link || ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "link", e.target.value)}
                          placeholder="Live Link"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.github || ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "github", e.target.value)}
                          placeholder="GitHub Link"
                          style={{
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            padding: "0.25rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: "1.125rem", fontWeight: "600" }}>{project.name}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem" }}>{project.description}</div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          Technologies: {project.technologies ? project.technologies.join(", ") : ""}
                        </div>
                        <div style={{ color: "#374151", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                          <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                            Live Demo
                          </a>
                          {" | "}
                          <a href={project.github} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>
                            GitHub
                          </a>
                        </div>
                      </>
                    )}
                    {editMode && activeSection === "projects" && (
                      <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                          }}
                          onClick={addProject}
                        >
                          <FaPlus /> New Project
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0.75rem",
                            backgroundColor: "#dc2626",
                            color: "white",
                            borderRadius: "0.375rem",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                          onClick={() => removeProject(index)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    )}
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resume Container - TWO COLUMN LAYOUT */}
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              borderRadius: "0.75rem",
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "35% 65%",
              minHeight: "1100px"
            }}
          >
            {/* LEFT SIDEBAR - Dark Background */}
            <div style={{
              backgroundColor: "#1e3a8a",
              color: "white",
              padding: "2rem 1.5rem"
            }}>
              {/* Profile Section */}
              {visibleFields.name && (
                <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                  {editMode ? (
                    <input
                      type="text"
                      value={localData.name || ""}
                      onChange={(e) => handleFieldChange("name", e.target.value)}
                      placeholder="Your Name"
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: "bold",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        padding: "0.5rem",
                        borderRadius: "0.375rem",
                        width: "100%",
                        textAlign: "center"
                      }}
                    />
                  ) : (
                    <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {localData.name || "Your Name"}
                    </h1>
                  )}
                </div>
              )}

              {visibleFields.designation && (
                <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                  {editMode ? (
                    <input
                      type="text"
                      value={localData.designation || ""}
                      onChange={(e) => handleFieldChange("designation", e.target.value)}
                      placeholder="Job Title"
                      style={{
                        fontSize: "1.125rem",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.3)",
                        padding: "0.5rem",
                        borderRadius: "0.375rem",
                        width: "100%",
                        textAlign: "center"
                      }}
                    />
                  ) : (
                    <h2 style={{ fontSize: "1.125rem", color: "#93c5fd" }}>
                      {localData.designation || "Job Title"}
                    </h2>
                  )}
                </div>
              )}

              {/* Contact Info */}
              {visibleFields.contact && (
                <div style={{ marginBottom: "2rem", borderTop: "2px solid rgba(255,255,255,0.2)", paddingTop: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#93c5fd" }}>
                    Contact
                  </h3>
                  {editMode ? (
                    <>
                      <textarea
                        value={localData.contact || ""}
                        onChange={(e) => handleFieldChange("contact", e.target.value)}
                        placeholder="Email, Phone, Location (one per line)"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.3)",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          width: "100%",
                          minHeight: "100px",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="url"
                        value={localData.linkedin || ""}
                        onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                        placeholder="LinkedIn URL"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.3)",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          width: "100%",
                          fontSize: "0.875rem",
                          marginBottom: "0.5rem"
                        }}
                      />
                      <input
                        type="url"
                        value={localData.github || ""}
                        onChange={(e) => handleFieldChange("github", e.target.value)}
                        placeholder="GitHub URL"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.3)",
                          padding: "0.5rem",
                          borderRadius: "0.375rem",
                          width: "100%",
                          fontSize: "0.875rem"
                        }}
                      />
                    </>
                  ) : (
                    <div style={{ fontSize: "0.875rem", lineHeight: "1.75" }}>
                      {localData.contact && localData.contact.split('\n').map((line, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                          {line.includes('@') && <FaEnvelope style={{ marginRight: "0.5rem", color: "#93c5fd" }} />}
                          {line.match(/\d{10}/) && <FaPhone style={{ marginRight: "0.5rem", color: "#93c5fd" }} />}
                          {!line.includes('@') && !line.match(/\d{10}/) && <FaMapMarkerAlt style={{ marginRight: "0.5rem", color: "#93c5fd" }} />}
                          <span>{line}</span>
                        </div>
                      ))}
                      {localData.linkedin && (
                        <div style={{ marginTop: "0.75rem" }}>
                          <a
                            href={localData.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                              textDecoration: "none",
                              marginBottom: "0.5rem",
                              transition: "color 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "#93c5fd"}
                            onMouseOut={(e) => e.currentTarget.style.color = "white"}
                          >
                            <FaLinkedin style={{ marginRight: "0.5rem", color: "#93c5fd" }} />
                            <span>LinkedIn</span>
                          </a>
                        </div>
                      )}
                      {localData.github && (
                        <div>
                          <a
                            href={localData.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "white",
                              textDecoration: "none",
                              transition: "color 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = "#93c5fd"}
                            onMouseOut={(e) => e.currentTarget.style.color = "white"}
                          >
                            <FaGithub style={{ marginRight: "0.5rem", color: "#93c5fd" }} />
                            <span>GitHub</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {visibleFields.skills && (localData.skills || []).length > 0 && (
                <div style={{ marginBottom: "2rem", borderTop: "2px solid rgba(255,255,255,0.2)", paddingTop: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#93c5fd" }}>
                    Skills
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(localData.skills || []).map((skill, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        {editMode ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => {
                                const updatedSkills = [...(localData.skills || [])];
                                updatedSkills[index] = e.target.value;
                                handleFieldChange("skills", updatedSkills);
                              }}
                              style={{
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.3)",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "9999px",
                                fontSize: "0.875rem"
                              }}
                            />
                            <button
                              onClick={() => removeSkill(index)}
                              style={{
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ) : (
                          <span style={{
                            backgroundColor: "rgba(255,255,255,0.15)",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "9999px",
                            fontSize: "0.875rem",
                            display: "inline-block"
                          }}>
                            {skill}
                          </span>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={addSkill}
                        style={{
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "9999px",
                          padding: "0.375rem 0.75rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        <FaPlus size={12} /> Add
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {visibleFields.languages && (localData.languages || []).length > 0 && (
                <div style={{ marginBottom: "2rem", borderTop: "2px solid rgba(255,255,255,0.2)", paddingTop: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: "#93c5fd" }}>
                    Languages
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {(localData.languages || []).map((lang, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {editMode ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
                            <input
                              type="text"
                              value={lang}
                              onChange={(e) => {
                                const updatedLanguages = [...(localData.languages || [])];
                                updatedLanguages[index] = e.target.value;
                                handleFieldChange("languages", updatedLanguages);
                              }}
                              style={{
                                backgroundColor: "rgba(255,255,255,0.1)",
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.3)",
                                padding: "0.375rem 0.75rem",
                                borderRadius: "0.375rem",
                                fontSize: "0.875rem",
                                flex: 1
                              }}
                            />
                            <button
                              onClick={() => removeLanguage(index)}
                              style={{
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "24px",
                                height: "24px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.875rem" }}>• {lang}</span>
                        )}
                      </div>
                    ))}
                    {editMode && (
                      <button
                        onClick={addLanguage}
                        style={{
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          padding: "0.375rem 0.75rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          marginTop: "0.5rem"
                        }}
                      >
                        <FaPlus size={12} /> Add Language
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT CONTENT AREA */}
            <div style={{ padding: "2rem" }}>
              {/* Summary Section */}
              {visibleFields.summary && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#1e3a8a",
                    borderBottom: "3px solid #3b82f6",
                    paddingBottom: "0.5rem"
                  }}>
                    Professional Summary
                  </h3>
                  {editMode ? (
                    <textarea
                      value={localData.summary || ""}
                      onChange={(e) => handleFieldChange("summary", e.target.value)}
                      placeholder="Write a brief summary about yourself"
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        fontSize: "0.95rem",
                        lineHeight: "1.6"
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#374151" }}>
                      {localData.summary || "Your professional summary goes here"}
                    </p>
                  )}
                </div>
              )}

              {/* Experience Section */}
              {visibleFields.experience && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#1e3a8a",
                    borderBottom: "3px solid #3b82f6",
                    paddingBottom: "0.5rem"
                  }}>
                    Work Experience
                  </h3>
                  {(localData.experience || []).map((exp, index) => (
                    <div key={index} style={{
                      marginBottom: "1.5rem",
                      paddingLeft: "1rem",
                      borderLeft: "3px solid #93c5fd"
                    }}>
                      {editMode ? (
                        <div style={{ marginBottom: "1rem" }}>
                          <input
                            type="text"
                            value={exp.title || ""}
                            onChange={(e) => handleArrayFieldChange("experience", index, "title", e.target.value)}
                            placeholder="Job Title"
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              width: "100%",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <input
                            type="text"
                            value={exp.companyName || ""}
                            onChange={(e) => handleArrayFieldChange("experience", index, "companyName", e.target.value)}
                            placeholder="Company Name"
                            style={{
                              fontSize: "1rem",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              width: "100%",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={exp.date || ""}
                              onChange={(e) => handleArrayFieldChange("experience", index, "date", e.target.value)}
                              placeholder="Date Range"
                              style={{
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                            <input
                              type="text"
                              value={exp.companyLocation || ""}
                              onChange={(e) => handleArrayFieldChange("experience", index, "companyLocation", e.target.value)}
                              placeholder="Location"
                              style={{
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                          </div>
                          <textarea
                            value={(exp.accomplishment || []).join('\n')}
                            onChange={(e) => handleArrayFieldChange("experience", index, "accomplishment", e.target.value.split('\n'))}
                            placeholder="Accomplishments (one per line)"
                            style={{
                              marginTop: "0.5rem",
                              width: "100%",
                              minHeight: "80px",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem"
                            }}
                          />
                          <button
                            onClick={() => removeExperience(index)}
                            style={{
                              marginTop: "0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem"
                            }}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem", color: "#1e3a8a" }}>
                            {exp.title}
                          </h4>
                          <div style={{ fontSize: "0.95rem", color: "#3b82f6", marginBottom: "0.25rem", fontWeight: "500" }}>
                            {exp.companyName}
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                            {exp.date} • {exp.companyLocation}
                          </div>
                          <ul style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                            {(exp.accomplishment || []).map((acc, accIndex) => (
                              <li key={accIndex} style={{ fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "0.25rem", color: "#374151" }}>
                                {acc}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={addExperience}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "1rem"
                      }}
                    >
                      <FaPlus /> Add Experience
                    </button>
                  )}
                </div>
              )}

              {/* Projects Section */}
              {visibleFields.projects && (localData.projects || []).length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#1e3a8a",
                    borderBottom: "3px solid #3b82f6",
                    paddingBottom: "0.5rem"
                  }}>
                    Projects
                  </h3>
                  {(localData.projects || []).map((project, index) => (
                    <div key={index} style={{
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      backgroundColor: "#f9fafb",
                      borderRadius: "0.5rem",
                      borderLeft: "4px solid #3b82f6"
                    }}>
                      {editMode ? (
                        <div>
                          <input
                            type="text"
                            value={project.name || ""}
                            onChange={(e) => handleArrayFieldChange("projects", index, "name", e.target.value)}
                            placeholder="Project Name"
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              width: "100%",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <textarea
                            value={project.description || ""}
                            onChange={(e) => handleArrayFieldChange("projects", index, "description", e.target.value)}
                            placeholder="Project Description"
                            style={{
                              width: "100%",
                              minHeight: "60px",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <input
                            type="text"
                            value={project.technologies ? project.technologies.join(", ") : ""}
                            onChange={(e) => handleArrayFieldChange("projects", index, "technologies", e.target.value.split(",").map(t => t.trim()))}
                            placeholder="Technologies (comma separated)"
                            style={{
                              width: "100%",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <button
                            onClick={() => removeProject(index)}
                            style={{
                              backgroundColor: "#dc2626",
                              color: "white",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem"
                            }}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem", color: "#1e3a8a" }}>
                            {project.name}
                          </h4>
                          <p style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "0.5rem", lineHeight: "1.6" }}>
                            {project.description}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                            {(project.technologies || []).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                style={{
                                  backgroundColor: "#dbeafe",
                                  color: "#1e3a8a",
                                  padding: "0.25rem 0.625rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: "500"
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={addProject}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <FaPlus /> Add Project
                    </button>
                  )}
                </div>
              )}

              {/* Education Section */}
              {visibleFields.education && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#1e3a8a",
                    borderBottom: "3px solid #3b82f6",
                    paddingBottom: "0.5rem"
                  }}>
                    Education
                  </h3>
                  {(localData.education || []).map((edu, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                      {editMode ? (
                        <div>
                          <input
                            type="text"
                            value={edu.degree || ""}
                            onChange={(e) => handleArrayFieldChange("education", index, "degree", e.target.value)}
                            placeholder="Degree"
                            style={{
                              fontSize: "1.125rem",
                              fontWeight: "600",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              width: "100%",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <input
                            type="text"
                            value={edu.institution || ""}
                            onChange={(e) => handleArrayFieldChange("education", index, "institution", e.target.value)}
                            placeholder="Institution"
                            style={{
                              fontSize: "1rem",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              width: "100%",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={edu.duration || ""}
                              onChange={(e) => handleArrayFieldChange("education", index, "duration", e.target.value)}
                              placeholder="Duration"
                              style={{
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                            <input
                              type="text"
                              value={edu.location || ""}
                              onChange={(e) => handleArrayFieldChange("education", index, "location", e.target.value)}
                              placeholder="Location"
                              style={{
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                          </div>
                          <button
                            onClick={() => removeEducation(index)}
                            style={{
                              marginTop: "0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem"
                            }}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem", color: "#1e3a8a" }}>
                            {edu.degree}
                          </h4>
                          <div style={{ fontSize: "0.95rem", color: "#3b82f6", marginBottom: "0.25rem" }}>
                            {edu.institution}
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                            {edu.duration} • {edu.location}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={addEducation}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <FaPlus /> Add Education
                    </button>
                  )}
                </div>
              )}

              {/* Achievements Section */}
              {visibleFields.achievements && (localData.achievements || []).length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#1e3a8a",
                    borderBottom: "3px solid #3b82f6",
                    paddingBottom: "0.5rem"
                  }}>
                    Achievements
                  </h3>
                  <ul style={{ marginLeft: "1rem" }}>
                    {(localData.achievements || []).map((achievement, index) => (
                      <li key={index} style={{ fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "0.5rem", color: "#374151" }}>
                        {editMode ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const updatedAchievements = [...(localData.achievements || [])];
                                updatedAchievements[index] = e.target.value;
                                handleFieldChange("achievements", updatedAchievements);
                              }}
                              style={{
                                flex: 1,
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                            <button
                              onClick={() => removeAchievement(index)}
                              style={{
                                backgroundColor: "#dc2626",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "28px",
                                height: "28px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ) : (
                          achievement
                        )}
                      </li>
                    ))}
                  </ul>
                  {editMode && (
                    <button
                      onClick={addAchievement}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginTop: "0.5rem"
                      }}
                    >
                      <FaPlus /> Add Achievement
                    </button>
                  )}
                </div>
              )}

              {/* Certifications Section */}
              {visibleFields.courses && (localData.certifications || []).length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#1e3a8a",
                    borderBottom: "3px solid #3b82f6",
                    paddingBottom: "0.5rem"
                  }}>
                    Certifications
                  </h3>
                  {(localData.certifications || []).map((cert, index) => (
                    <div key={index} style={{ marginBottom: "1rem" }}>
                      {editMode ? (
                        <div>
                          <input
                            type="text"
                            value={cert.title || ""}
                            onChange={(e) => handleArrayFieldChange("certifications", index, "title", e.target.value)}
                            placeholder="Certification Title"
                            style={{
                              fontSize: "1rem",
                              fontWeight: "600",
                              border: "1px solid #d1d5db",
                              padding: "0.5rem",
                              borderRadius: "0.375rem",
                              width: "100%",
                              marginBottom: "0.5rem"
                            }}
                          />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                            <input
                              type="text"
                              value={cert.issuer || ""}
                              onChange={(e) => handleArrayFieldChange("certifications", index, "issuer", e.target.value)}
                              placeholder="Issuer"
                              style={{
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                            <input
                              type="text"
                              value={cert.date || ""}
                              onChange={(e) => handleArrayFieldChange("certifications", index, "date", e.target.value)}
                              placeholder="Date"
                              style={{
                                fontSize: "0.875rem",
                                border: "1px solid #d1d5db",
                                padding: "0.5rem",
                                borderRadius: "0.375rem"
                              }}
                            />
                          </div>
                          <button
                            onClick={() => removeCourse(index)}
                            style={{
                              marginTop: "0.5rem",
                              backgroundColor: "#dc2626",
                              color: "white",
                              padding: "0.375rem 0.75rem",
                              borderRadius: "0.375rem",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem"
                            }}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.25rem", color: "#1e3a8a" }}>
                            {cert.title}
                          </h4>
                          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                            {cert.issuer} • {cert.date}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={addCourse}
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <FaPlus /> Add Certification
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            {editMode ? (
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
<<<<<<< HEAD
                    padding: "0.75rem 2rem",
                    borderRadius: "0.5rem",
=======
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    marginRight: "0.5rem",
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
<<<<<<< HEAD
                    padding: "0.75rem 2rem",
                    borderRadius: "0.5rem",
=======
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
<<<<<<< HEAD
                  padding: "0.75rem 2rem",
                  borderRadius: "0.5rem",
=======
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
              >
                Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            padding: 1rem !important;
          }
          div[style*="gridTemplateColumns: \"35% 65%\""] {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (min-width: 1024px) {
          .main-content {
            margin-left: 20rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Template9;
