import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { useResume } from "../../context/ResumeContext";
import { useAuth } from "../../context/AuthContext";
import resumeService from "../../services/resumeService";
import { toast } from "react-toastify";
import { Download, Upload, Share, Settings, Edit, Plus, Save, Trash2, Bot, ArrowUp, ArrowDown, Mail, Linkedin, Github } from "lucide-react";

const Template10 = () => {
  const resumeRef = useRef(null);
  const { resumeData, setResumeData, updateResumeData } = useResume();
  const { isAuthenticated } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [localData, setLocalData] = useState(() => {
    return {
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      summary: "",
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      achievements: [],
      skills: [],
      languages: [],
      interests: []
    };
  });
  const [sections, setSections] = useState(["header", "summary", "experience", "achievements", "projects", "education", "skills"]);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [editingSections, setEditingSections] = useState({});
  const [editingHeader, setEditingHeader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const saveTimeoutRef = useRef(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Data normalization functions (keeping the original logic)
  const sanitizeResumeData = (data) => {
    if (!data || typeof data !== 'object') {
      return {
        name: "",
        role: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        summary: "",
        experience: [],
        education: [],
        projects: [],
        certifications: [],
        achievements: [],
        skills: [],
        languages: [],
        interests: []
      };
    }

    const isPlaceholderString = (s) => {
      if (typeof s !== 'string') return false;
      const trimmed = s.trim();
      if (trimmed.length === 0) return true;
      if (/^[\-–—\s]+$/.test(trimmed)) return true;
      if (/^\s*(?:your|add|example|placeholder|new|company|institution|position|location|degree|title|issuer|start\s*-\s*end)\b/i.test(trimmed)) return true;
      return false;
    };

    const isValueFilled = (val) => {
      if (val == null) return false;
      if (typeof val === 'string') return !isPlaceholderString(val) && val.trim().length > 0;
      if (Array.isArray(val)) return val.some(v => isValueFilled(v));
      if (typeof val === 'object') return Object.values(val).some(v => isValueFilled(v));
      return Boolean(val);
    };

    const normalizeExperience = (experience) => {
      if (!Array.isArray(experience)) return [];
      return experience.map(exp => {
        if (typeof exp !== 'object' || exp === null) return null;

        let accomplishment = [];
        if (Array.isArray(exp.accomplishment)) {
          accomplishment = exp.accomplishment;
        } else if (exp.accomplishment) {
          if (typeof exp.accomplishment === 'string') {
            accomplishment = exp.accomplishment.split('\n').filter(a => a.trim());
          } else {
            accomplishment = [String(exp.accomplishment)];
          }
        } else if (exp.responsibilities) {
          if (Array.isArray(exp.responsibilities)) {
            accomplishment = exp.responsibilities;
          } else if (typeof exp.responsibilities === 'string') {
            accomplishment = exp.responsibilities.split('\n').filter(a => a.trim());
          } else {
            accomplishment = [String(exp.responsibilities)];
          }
        }

        return {
          id: exp.id || Date.now() + Math.random(),
          title: exp.title || exp.jobTitle || "",
          companyName: exp.companyName || exp.company || "",
          date: exp.date || (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : (exp.startDate || exp.endDate || "")),
          companyLocation: exp.companyLocation || exp.location || "",
          accomplishment: accomplishment
        };
      }).filter(exp => exp !== null && isValueFilled(exp));
    };

    const normalizeEducation = (education) => {
      if (!Array.isArray(education)) return [];
      return education.map(edu => {
        if (typeof edu !== 'object' || edu === null) return null;
        return {
          id: edu.id || Date.now() + Math.random(),
          degree: edu.degree || "",
          institution: edu.institution || "",
          duration: edu.duration || edu.year || "",
          location: edu.location || ""
        };
      }).filter(edu => edu !== null && isValueFilled(edu));
    };

    const normalizeProjects = (projects) => {
      if (!Array.isArray(projects)) return [];
      return projects.map(proj => {
        if (typeof proj !== 'object' || proj === null) return null;

        let technologies = [];
        if (Array.isArray(proj.technologies)) {
          technologies = proj.technologies;
        } else if (proj.technologies) {
          if (typeof proj.technologies === 'string') {
            technologies = proj.technologies.split(',').map(t => t.trim()).filter(Boolean);
          } else {
            technologies = [String(proj.technologies)];
          }
        }

        return {
          id: proj.id || Date.now() + Math.random(),
          name: proj.name || "",
          description: proj.description || "",
          technologies: technologies,
          link: proj.link || "",
          github: proj.github || ""
        };
      }).filter(proj => proj !== null && isValueFilled(proj));
    };

    const normalizeCertifications = (certifications) => {
      if (!Array.isArray(certifications)) return [];
      return certifications.map(cert => {
        if (typeof cert !== 'object' || cert === null) return null;
        return {
          id: cert.id || Date.now() + Math.random(),
          title: cert.title || "",
          issuer: cert.issuer || "",
          date: cert.date || ""
        };
      }).filter(cert => cert !== null && isValueFilled(cert));
    };

    const normalizeAchievements = (achievements) => {
      if (!Array.isArray(achievements)) return [];
      return achievements.map(achievement => {
        if (typeof achievement === 'string') {
          return achievement.trim();
        }
        if (typeof achievement === 'object' && achievement !== null) {
          return achievement.title || achievement.description || achievement.name || "";
        }
        return String(achievement || "");
      }).filter(achievement => achievement && achievement.trim().length > 0);
    };

    const normalizeArrayField = (field) => {
      if (Array.isArray(field)) {
        return field.filter(item => item && String(item).trim().length > 0);
      }
      if (typeof field === 'string' && field.trim()) {
        return field.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    };

    if (Array.isArray(data.workExperience) && data.workExperience.length > 0) {
      data.experience = [...(data.experience || []), ...normalizeExperience(data.workExperience)];
      delete data.workExperience;
    }

    return {
      name: data.name || "",
      role: data.role || data.designation || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      summary: data.summary || "",
      experience: normalizeExperience(data.experience),
      education: normalizeEducation(data.education),
      projects: normalizeProjects(data.projects),
      certifications: normalizeCertifications(data.certifications),
      achievements: normalizeAchievements(data.achievements),
      skills: normalizeArrayField(data.skills),
      languages: normalizeArrayField(data.languages),
      interests: normalizeArrayField(data.interests)
    };
  };

  useEffect(() => {
    const sanitized = sanitizeResumeData(resumeData);
    setLocalData(sanitized);
  }, [resumeData]);

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    setResumeData(updatedData);
  };

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...(localData[section] || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [key]: value };
      const updatedData = { ...localData, [section]: updated };
      setLocalData(updatedData);
      setResumeData(updatedData);
    }
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
    setEditingSections({});
    toast.success("Resume saved successfully!");
  };

  const handleCancel = () => {
    setLocalData(sanitizeResumeData(resumeData));
    setEditMode(false);
    setEditingSections({});
  };

  const addExperience = () => {
    setLocalData({
      ...localData,
      experience: [
        ...(localData.experience || []),
        {
          title: "",
          companyName: "",
          date: "",
          companyLocation: "",
          accomplishment: []
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

  const addProject = () => {
    setLocalData({
      ...localData,
      projects: [
        ...(localData.projects || []),
        {
          name: "",
          description: "",
          technologies: [],
          link: "",
          github: ""
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

  const addEducation = () => {
    setLocalData({
      ...localData,
      education: [
        ...(localData.education || []),
        { degree: "", duration: "", institution: "", location: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    setLocalData({
      ...localData,
      education: (localData.education || []).filter((_, i) => i !== index),
    });
  };

  const addCertification = () => {
    setLocalData({
      ...localData,
      certifications: [
        ...(localData.certifications || []),
        { title: "", issuer: "", date: "" },
      ],
    });
  };

  const removeCertification = (index) => {
    setLocalData({
      ...localData,
      certifications: (localData.certifications || []).filter((_, i) => i !== index),
    });
  };

  const addAchievement = () => {
    setLocalData({
      ...localData,
      achievements: [...(localData.achievements || []), ""],
    });
  };

  const removeAchievement = (index) => {
    setLocalData({
      ...localData,
      achievements: (localData.achievements || []).filter((_, i) => i !== index),
    });
  };

  const SectionButtons = ({ section }) => {
    if (!editMode) return null;
    return (
      <div style={{
        position: "absolute",
        top: "0.5rem",
        right: "0.5rem",
        display: "flex",
        gap: "0.5rem"
      }}>
        <button
          onClick={() => setEditingSections(prev => ({ ...prev, [section]: !prev[section] }))}
          style={{
            backgroundColor: editingSections[section] ? "#10b981" : "#6b7280",
            color: "white",
            padding: "0.375rem 0.75rem",
            borderRadius: "0.375rem",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}
        >
          <Edit size={14} /> {editingSections[section] ? "Done" : "Edit"}
        </button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar resumeRef={resumeRef} />

        {/* Main Content */}
        <div className="main-content" style={{ flex: 1, padding: "3rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
          {/* Resume Container - MINIMALIST SINGLE COLUMN */}
          <div
            ref={resumeRef}
            style={{
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              padding: "3rem",
              borderRadius: "0.25rem",
              minHeight: "1100px"
            }}
          >
            {/* Header Section */}
            <header style={{ 
              marginBottom: "2.5rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #e5e7eb"
            }}>
              {editMode ? (
                <div>
                  <input
                    type="text"
                    value={localData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Full Name"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "700",
                      border: "none",
                      borderBottom: "2px solid #e5e7eb",
                      padding: "0.5rem 0",
                      width: "100%",
                      marginBottom: "0.75rem",
                      color: "#111827",
                      outline: "none"
                    }}
                  />
                  <input
                    type="text"
                    value={localData.role || ""}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    placeholder="Professional Title"
                    style={{
                      fontSize: "1.25rem",
                      border: "none",
                      borderBottom: "1px solid #e5e7eb",
                      padding: "0.25rem 0",
                      width: "100%",
                      marginBottom: "1rem",
                      color: "#6b7280",
                      outline: "none"
                    }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginTop: "1rem" }}>
                    <input
                      type="email"
                      value={localData.email || ""}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      placeholder="Email"
                      style={{
                        fontSize: "0.875rem",
                        border: "1px solid #e5e7eb",
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        color: "#374151"
                      }}
                    />
                    <input
                      type="tel"
                      value={localData.phone || ""}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      placeholder="Phone"
                      style={{
                        fontSize: "0.875rem",
                        border: "1px solid #e5e7eb",
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        color: "#374151"
                      }}
                    />
                    <input
                      type="text"
                      value={localData.location || ""}
                      onChange={(e) => handleFieldChange("location", e.target.value)}
                      placeholder="Location"
                      style={{
                        fontSize: "0.875rem",
                        border: "1px solid #e5e7eb",
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        color: "#374151"
                      }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <input
                      type="url"
                      value={localData.linkedin || ""}
                      onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                      placeholder="LinkedIn URL"
                      style={{
                        fontSize: "0.875rem",
                        border: "1px solid #e5e7eb",
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        color: "#374151"
                      }}
                    />
                    <input
                      type="url"
                      value={localData.github || ""}
                      onChange={(e) => handleFieldChange("github", e.target.value)}
                      placeholder="GitHub URL"
                      style={{
                        fontSize: "0.875rem",
                        border: "1px solid #e5e7eb",
                        padding: "0.5rem",
                        borderRadius: "0.25rem",
                        color: "#374151"
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 style={{ 
                    fontSize: "2.5rem", 
                    fontWeight: "700", 
                    marginBottom: "0.5rem",
                    color: "#111827",
                    letterSpacing: "-0.025em"
                  }}>
                    {localData.name || "Your Name"}
                  </h1>
                  <h2 style={{ 
                    fontSize: "1.25rem", 
                    color: "#6b7280",
                    fontWeight: "400",
                    marginBottom: "1rem"
                  }}>
                    {localData.role || "Professional Title"}
                  </h2>
                  <div style={{ 
                    display: "flex", 
                    gap: "1.5rem", 
                    fontSize: "0.875rem",
                    color: "#374151",
                    flexWrap: "wrap"
                  }}>
                    {localData.email && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                        <Mail size={16} />
                        {localData.email}
                      </span>
                    )}
                    {localData.phone && <span>{localData.phone}</span>}
                    {localData.location && <span>{localData.location}</span>}
                    {localData.linkedin && (
                      <a 
                        href={localData.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.375rem",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "color 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#111827"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#374151"}
                      >
                        <Linkedin size={16} />
                        LinkedIn
                      </a>
                    )}
                    {localData.github && (
                      <a 
                        href={localData.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.375rem",
                          color: "#374151",
                          textDecoration: "none",
                          transition: "color 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#111827"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#374151"}
                      >
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                  </div>
                </>
              )}
            </header>

            {/* Summary Section */}
            {(localData.summary || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="summary" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Professional Summary
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1rem"
                }}></div>
                {editMode ? (
                  <textarea
                    value={localData.summary || ""}
                    onChange={(e) => handleFieldChange("summary", e.target.value)}
                    placeholder="Write a brief professional summary..."
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.25rem",
                      fontSize: "0.95rem",
                      lineHeight: "1.7",
                      color: "#374151",
                      fontFamily: "inherit"
                    }}
                  />
                ) : (
                  <p style={{ 
                    fontSize: "0.95rem", 
                    lineHeight: "1.7", 
                    color: "#374151",
                    textAlign: "justify"
                  }}>
                    {localData.summary}
                  </p>
                )}
              </section>
            )}

            {/* Experience Section */}
            {((localData.experience && localData.experience.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="experience" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Experience
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1.5rem"
                }}></div>
                
                {(localData.experience || []).map((exp, index) => (
                  <div key={index} style={{ 
                    marginBottom: "2rem",
                    paddingLeft: "1.5rem",
                    position: "relative"
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: "absolute",
                      left: "0",
                      top: "0.375rem",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#111827",
                      borderRadius: "50%"
                    }}></div>
                    
                    {editMode ? (
                      <div>
                        <input
                          type="text"
                          value={exp.title || ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "title", e.target.value)}
                          placeholder="Job Title"
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: "600",
                            border: "none",
                            borderBottom: "1px solid #e5e7eb",
                            padding: "0.25rem 0",
                            width: "100%",
                            marginBottom: "0.5rem",
                            color: "#111827"
                          }}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <input
                            type="text"
                            value={exp.companyName || ""}
                            onChange={(e) => handleArrayFieldChange("experience", index, "companyName", e.target.value)}
                            placeholder="Company"
                            style={{
                              fontSize: "0.95rem",
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem",
                              color: "#374151"
                            }}
                          />
                          <input
                            type="text"
                            value={exp.companyLocation || ""}
                            onChange={(e) => handleArrayFieldChange("experience", index, "companyLocation", e.target.value)}
                            placeholder="Location"
                            style={{
                              fontSize: "0.95rem",
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem",
                              color: "#374151"
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          value={exp.date || ""}
                          onChange={(e) => handleArrayFieldChange("experience", index, "date", e.target.value)}
                          placeholder="Date Range (e.g., Jan 2020 - Present)"
                          style={{
                            fontSize: "0.875rem",
                            border: "1px solid #e5e7eb",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            width: "100%",
                            marginBottom: "0.5rem",
                            color: "#6b7280"
                          }}
                        />
                        <textarea
                          value={(exp.accomplishment || []).join('\n')}
                          onChange={(e) => handleArrayFieldChange("experience", index, "accomplishment", e.target.value.split('\n').filter(a => a.trim()))}
                          placeholder="Key accomplishments (one per line)"
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            border: "1px solid #e5e7eb",
                            padding: "0.75rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.9rem",
                            lineHeight: "1.6"
                          }}
                        />
                        <button
                          onClick={() => removeExperience(index)}
                          style={{
                            marginTop: "0.75rem",
                            backgroundColor: "#ef4444",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.25rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem"
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "baseline",
                          marginBottom: "0.25rem",
                          flexWrap: "wrap"
                        }}>
                          <h4 style={{ 
                            fontSize: "1.125rem", 
                            fontWeight: "600",
                            color: "#111827"
                          }}>
                            {exp.title}
                          </h4>
                          <span style={{ 
                            fontSize: "0.875rem", 
                            color: "#6b7280",
                            fontStyle: "italic"
                          }}>
                            {exp.date}
                          </span>
                        </div>
                        <div style={{ 
                          fontSize: "0.95rem", 
                          color: "#374151",
                          marginBottom: "0.125rem"
                        }}>
                          {exp.companyName}
                        </div>
                        <div style={{ 
                          fontSize: "0.875rem", 
                          color: "#6b7280",
                          marginBottom: "0.75rem"
                        }}>
                          {exp.companyLocation}
                        </div>
                        {exp.accomplishment && exp.accomplishment.length > 0 && (
                          <ul style={{ 
                            marginLeft: "1rem",
                            marginTop: "0.5rem"
                          }}>
                            {exp.accomplishment.map((acc, accIndex) => (
                              <li key={accIndex} style={{ 
                                fontSize: "0.9rem", 
                                lineHeight: "1.6", 
                                marginBottom: "0.375rem",
                                color: "#374151"
                              }}>
                                {acc}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                ))}
                
                {editMode && (
                  <button
                    onClick={addExperience}
                    style={{
                      backgroundColor: "#111827",
                      color: "white",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "0.25rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "1rem"
                    }}
                  >
                    <Plus size={16} /> Add Experience
                  </button>
                )}
              </section>
            )}

            {/* Projects Section */}
            {((localData.projects && localData.projects.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="projects" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Projects
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1.5rem"
                }}></div>
                
                {(localData.projects || []).map((project, index) => (
                  <div key={index} style={{ 
                    marginBottom: "1.75rem",
                    paddingBottom: "1.5rem",
                    borderBottom: index !== (localData.projects || []).length - 1 ? "1px solid #f3f4f6" : "none"
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
                            border: "none",
                            borderBottom: "1px solid #e5e7eb",
                            padding: "0.25rem 0",
                            width: "100%",
                            marginBottom: "0.75rem",
                            color: "#111827"
                          }}
                        />
                        <textarea
                          value={project.description || ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "description", e.target.value)}
                          placeholder="Project description"
                          style={{
                            width: "100%",
                            minHeight: "70px",
                            border: "1px solid #e5e7eb",
                            padding: "0.75rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.9rem",
                            lineHeight: "1.6",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <input
                          type="text"
                          value={project.technologies ? project.technologies.join(", ") : ""}
                          onChange={(e) => handleArrayFieldChange("projects", index, "technologies", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                          placeholder="Technologies (comma separated)"
                          style={{
                            width: "100%",
                            border: "1px solid #e5e7eb",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            fontSize: "0.875rem",
                            marginBottom: "0.5rem"
                          }}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          <input
                            type="url"
                            value={project.link || ""}
                            onChange={(e) => handleArrayFieldChange("projects", index, "link", e.target.value)}
                            placeholder="Live Link"
                            style={{
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem",
                              fontSize: "0.875rem"
                            }}
                          />
                          <input
                            type="url"
                            value={project.github || ""}
                            onChange={(e) => handleArrayFieldChange("projects", index, "github", e.target.value)}
                            placeholder="GitHub Link"
                            style={{
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem",
                              fontSize: "0.875rem"
                            }}
                          />
                        </div>
                        <button
                          onClick={() => removeProject(index)}
                          style={{
                            marginTop: "0.75rem",
                            backgroundColor: "#ef4444",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.25rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem"
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 style={{ 
                          fontSize: "1.125rem", 
                          fontWeight: "600",
                          marginBottom: "0.5rem",
                          color: "#111827"
                        }}>
                          {project.name}
                        </h4>
                        <p style={{ 
                          fontSize: "0.9rem", 
                          lineHeight: "1.6", 
                          color: "#374151",
                          marginBottom: "0.625rem"
                        }}>
                          {project.description}
                        </p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div style={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: "0.5rem",
                            marginBottom: "0.5rem"
                          }}>
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#6b7280",
                                  border: "1px solid #e5e7eb",
                                  padding: "0.25rem 0.625rem",
                                  borderRadius: "0.25rem",
                                  fontWeight: "500"
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {(project.link || project.github) && (
                          <div style={{ 
                            fontSize: "0.875rem",
                            display: "flex",
                            gap: "1rem",
                            marginTop: "0.5rem"
                          }}>
                            {project.link && (
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  color: "#111827",
                                  textDecoration: "underline",
                                  textUnderlineOffset: "2px"
                                }}
                              >
                                Live Demo →
                              </a>
                            )}
                            {project.github && (
                              <a 
                                href={project.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  color: "#111827",
                                  textDecoration: "underline",
                                  textUnderlineOffset: "2px"
                                }}
                              >
                                GitHub →
                              </a>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                
                {editMode && (
                  <button
                    onClick={addProject}
                    style={{
                      backgroundColor: "#111827",
                      color: "white",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "0.25rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "1rem"
                    }}
                  >
                    <Plus size={16} /> Add Project
                  </button>
                )}
              </section>
            )}

            {/* Education Section */}
            {((localData.education && localData.education.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="education" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Education
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1.5rem"
                }}></div>
                
                {(localData.education || []).map((edu, index) => (
                  <div key={index} style={{ marginBottom: "1.5rem" }}>
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
                            border: "none",
                            borderBottom: "1px solid #e5e7eb",
                            padding: "0.25rem 0",
                            width: "100%",
                            marginBottom: "0.5rem",
                            color: "#111827"
                          }}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <input
                            type="text"
                            value={edu.institution || ""}
                            onChange={(e) => handleArrayFieldChange("education", index, "institution", e.target.value)}
                            placeholder="Institution"
                            style={{
                              fontSize: "0.95rem",
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem"
                            }}
                          />
                          <input
                            type="text"
                            value={edu.location || ""}
                            onChange={(e) => handleArrayFieldChange("education", index, "location", e.target.value)}
                            placeholder="Location"
                            style={{
                              fontSize: "0.95rem",
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem"
                            }}
                          />
                        </div>
                        <input
                          type="text"
                          value={edu.duration || ""}
                          onChange={(e) => handleArrayFieldChange("education", index, "duration", e.target.value)}
                          placeholder="Duration"
                          style={{
                            fontSize: "0.875rem",
                            border: "1px solid #e5e7eb",
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            width: "100%"
                          }}
                        />
                        <button
                          onClick={() => removeEducation(index)}
                          style={{
                            marginTop: "0.75rem",
                            backgroundColor: "#ef4444",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.25rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem"
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "baseline",
                          marginBottom: "0.25rem",
                          flexWrap: "wrap"
                        }}>
                          <h4 style={{ 
                            fontSize: "1.125rem", 
                            fontWeight: "600",
                            color: "#111827"
                          }}>
                            {edu.degree}
                          </h4>
                          <span style={{ 
                            fontSize: "0.875rem", 
                            color: "#6b7280",
                            fontStyle: "italic"
                          }}>
                            {edu.duration}
                          </span>
                        </div>
                        <div style={{ 
                          fontSize: "0.95rem", 
                          color: "#374151",
                          marginBottom: "0.125rem"
                        }}>
                          {edu.institution}
                        </div>
                        <div style={{ 
                          fontSize: "0.875rem", 
                          color: "#6b7280"
                        }}>
                          {edu.location}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {editMode && (
                  <button
                    onClick={addEducation}
                    style={{
                      backgroundColor: "#111827",
                      color: "white",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "0.25rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "1rem"
                    }}
                  >
                    <Plus size={16} /> Add Education
                  </button>
                )}
              </section>
            )}

            {/* Skills Section */}
            {((localData.skills && localData.skills.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="skills" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Skills
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1rem"
                }}></div>
                
                {editMode ? (
                  <input
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.25rem",
                      fontSize: "0.9rem"
                    }}
                    value={(localData.skills || []).join(', ')}
                    onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    placeholder="Enter skills separated by commas"
                  />
                ) : (
                  <p style={{ 
                    fontSize: "0.9rem", 
                    lineHeight: "1.7", 
                    color: "#374151"
                  }}>
                    {(localData.skills || []).join(' • ')}
                  </p>
                )}
              </section>
            )}

            {/* Languages & Interests */}
            {((localData.languages && localData.languages.length > 0) || (localData.interests && localData.interests.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem"
              }}>
                {/* Languages */}
                {((localData.languages && localData.languages.length > 0) || editMode) && (
                  <div>
                    <h3 style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "700", 
                      marginBottom: "0.75rem",
                      color: "#111827",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase"
                    }}>
                      Languages
                    </h3>
                    <div style={{ 
                      width: "3rem", 
                      height: "2px", 
                      backgroundColor: "#111827",
                      marginBottom: "1rem"
                    }}></div>
                    {editMode ? (
                      <input
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.25rem",
                          fontSize: "0.9rem"
                        }}
                        value={(localData.languages || []).join(', ')}
                        onChange={(e) => handleFieldChange('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="Languages"
                      />
                    ) : (
                      <p style={{ fontSize: "0.9rem", lineHeight: "1.7", color: "#374151" }}>
                        {(localData.languages || []).join(' • ')}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Interests */}
                {((localData.interests && localData.interests.length > 0) || editMode) && (
                  <div>
                    <h3 style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "700", 
                      marginBottom: "0.75rem",
                      color: "#111827",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase"
                    }}>
                      Interests
                    </h3>
                    <div style={{ 
                      width: "3rem", 
                      height: "2px", 
                      backgroundColor: "#111827",
                      marginBottom: "1rem"
                    }}></div>
                    {editMode ? (
                      <input
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.25rem",
                          fontSize: "0.9rem"
                        }}
                        value={(localData.interests || []).join(', ')}
                        onChange={(e) => handleFieldChange('interests', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="Interests"
                      />
                    ) : (
                      <p style={{ fontSize: "0.9rem", lineHeight: "1.7", color: "#374151" }}>
                        {(localData.interests || []).join(' • ')}
                      </p>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Achievements */}
            {((localData.achievements && localData.achievements.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="achievements" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Achievements
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1rem"
                }}></div>
                
                <ul style={{ marginLeft: "1.25rem" }}>
                  {(localData.achievements || []).map((achievement, index) => (
                    <li key={index} style={{ 
                      fontSize: "0.9rem", 
                      lineHeight: "1.7", 
                      marginBottom: "0.5rem",
                      color: "#374151"
                    }}>
                      {editMode ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const updated = [...(localData.achievements || [])];
                              updated[index] = e.target.value;
                              handleFieldChange("achievements", updated);
                            }}
                            style={{
                              flex: 1,
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem",
                              fontSize: "0.9rem"
                            }}
                          />
                          <button
                            onClick={() => removeAchievement(index)}
                            style={{
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "0.25rem",
                              padding: "0.5rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Trash2 size={14} />
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
                      backgroundColor: "#111827",
                      color: "white",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "0.25rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "1rem"
                    }}
                  >
                    <Plus size={16} /> Add Achievement
                  </button>
                )}
              </section>
            )}

            {/* Certifications */}
            {((localData.certifications && localData.certifications.length > 0) || editMode) && (
              <section style={{ 
                marginBottom: "2.5rem",
                position: "relative"
              }}>
                <SectionButtons section="certifications" />
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "700", 
                  marginBottom: "0.75rem",
                  color: "#111827",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}>
                  Certifications
                </h3>
                <div style={{ 
                  width: "3rem", 
                  height: "2px", 
                  backgroundColor: "#111827",
                  marginBottom: "1.5rem"
                }}></div>
                
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
                            border: "none",
                            borderBottom: "1px solid #e5e7eb",
                            padding: "0.25rem 0",
                            width: "100%",
                            marginBottom: "0.5rem",
                            color: "#111827"
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
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem"
                            }}
                          />
                          <input
                            type="text"
                            value={cert.date || ""}
                            onChange={(e) => handleArrayFieldChange("certifications", index, "date", e.target.value)}
                            placeholder="Date"
                            style={{
                              fontSize: "0.875rem",
                              border: "1px solid #e5e7eb",
                              padding: "0.5rem",
                              borderRadius: "0.25rem"
                            }}
                          />
                        </div>
                        <button
                          onClick={() => removeCertification(index)}
                          style={{
                            marginTop: "0.75rem",
                            backgroundColor: "#ef4444",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "0.25rem",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem"
                          }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 style={{ 
                          fontSize: "1rem", 
                          fontWeight: "600",
                          marginBottom: "0.25rem",
                          color: "#111827"
                        }}>
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
                    onClick={addCertification}
                    style={{
                      backgroundColor: "#111827",
                      color: "white",
                      padding: "0.625rem 1.25rem",
                      borderRadius: "0.25rem",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "1rem"
                    }}
                  >
                    <Plus size={16} /> Add Certification
                  </button>
                )}
              </section>
            )}
          </div>

          {/* Global Edit Controls */}
          <div style={{
            marginTop: "2rem",
            textAlign: "center",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "0.75rem 2rem",
                    borderRadius: "0.25rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Save size={18} /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "white",
                    padding: "0.75rem 2rem",
                    borderRadius: "0.25rem",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem"
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  backgroundColor: "#111827",
                  color: "white",
                  padding: "0.75rem 2rem",
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Edit size={18} /> Edit Resume
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
          .main-content {
            padding: 1.5rem 1rem !important;
          }
          div[style*="padding: \"3rem\""] {
            padding: 1.5rem !important;
          }
          h1[style*="fontSize: \"2.5rem\""] {
            font-size: 2rem !important;
          }
          div[style*="gridTemplateColumns: \"1fr 1fr\""] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridTemplateColumns: \"1fr 1fr 1fr\""] {
            grid-template-columns: 1fr !important;
          }
        }
        @media print {
          button {
            display: none !important;
          }
          div[style*="position: \"absolute\""] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Template10;
