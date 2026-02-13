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

<<<<<<< HEAD
=======
        // Ensure accomplishment is always an array
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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
<<<<<<< HEAD
    const sanitized = sanitizeResumeData(resumeData);
    setLocalData(sanitized);
  }, [resumeData]);
=======
    if (resumeData) {
      const cleaned = sanitizeResumeData(resumeData);
      setLocalData(cleaned);
    }
  }, []); // Only run on mount

  // Keep localData in sync with context resumeData when not actively editing
  useEffect(() => {
    if (!editMode && resumeData) {
      const cleaned = sanitizeResumeData(resumeData);
      setLocalData(cleaned);
    }
  }, [resumeData, editMode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Helper to determine whether a field/section has meaningful content
  const isFilled = (value) => {
    if (value == null) return false;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length === 0) return false;
      if (/^[\-–—\s]+$/.test(trimmed)) return false;
      if (/^\s*(?:your|add|example|placeholder|new|company|institution|position|location|degree|title|issuer|start\s*-\s*end)\b/i.test(trimmed)) return false;
      return true;
    }
    if (Array.isArray(value)) return value.length > 0 && value.some(v => isFilled(v));
    if (typeof value === 'object') return Object.values(value).some(v => isFilled(v));
    return Boolean(value);
  };

  // Function to save to database (extracted for reuse)
  const saveToDatabase = async (dataToSave) => {
    if (!isAuthenticated) return;

    try {
      const cleaned = sanitizeResumeData(dataToSave);

      // Transform flat data structure to backend expected format
      const structuredData = {
        templateId: 10, // Template10
        personalInfo: {
          name: cleaned.name || '',
          role: cleaned.role || '',
          email: cleaned.email || '',
          phone: cleaned.phone || '',
          location: cleaned.location || '',
          linkedin: cleaned.linkedin || '',
          github: cleaned.github || '',
          portfolio: cleaned.portfolio || ''
        },
        summary: cleaned.summary || '',
        skills: cleaned.skills || [],
        experience: cleaned.experience || [],
        education: cleaned.education || [],
        projects: cleaned.projects || [],
        certifications: cleaned.certifications || [],
        achievements: cleaned.achievements || [],
        interests: cleaned.interests || [],
        languages: cleaned.languages || []
      };

      const saveResult = await resumeService.saveResumeData(structuredData);
      if (saveResult && saveResult.success) {
        setIsAutoSaving(false);
        return true;
      } else {
        console.error('Auto-save error:', saveResult?.error);
        setIsAutoSaving(false);
        return false;
      }
    } catch (error) {
      console.error('Error auto-saving resume:', error);
      setIsAutoSaving(false);
      return false;
    }
  };

  // Debounced auto-save function
  const debouncedAutoSave = (dataToSave) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    saveTimeoutRef.current = setTimeout(async () => {
      if (isAuthenticated && editMode) {
        setIsAutoSaving(true);
        await saveToDatabase(dataToSave);
      }
    }, 2000); // Wait 2 seconds after last change
  };
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf

  const handleFieldChange = (field, value) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
<<<<<<< HEAD
    setResumeData(updatedData);
=======

    // Save to localStorage via context immediately
    if (updateResumeData) {
      updateResumeData(updatedData);
    }

    // Trigger debounced database save
    if (isAuthenticated && editMode) {
      debouncedAutoSave(updatedData);
    }
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
  };

  const handleArrayFieldChange = (section, index, key, value) => {
    const updated = [...(localData[section] || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [key]: value };
      const updatedData = { ...localData, [section]: updated };
      setLocalData(updatedData);
<<<<<<< HEAD
      setResumeData(updatedData);
    }
  };

  const handleSave = () => {
    setResumeData(localData);
    setEditMode(false);
    setEditingSections({});
    toast.success("Resume saved successfully!");
=======

      // Save to localStorage via context immediately
      if (updateResumeData) {
        updateResumeData(updatedData);
      }

      // Trigger debounced database save
      if (isAuthenticated && editMode) {
        debouncedAutoSave(updatedData);
      }
    }
  };

  const handleSave = async () => {
    try {
      // Clear any pending auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      const cleaned = sanitizeResumeData(localData);

      // Save to localStorage via context
      if (updateResumeData) {
        updateResumeData(cleaned);
      } else {
        setResumeData(cleaned);
      }
      setLocalData(cleaned);

      // Save to database if user is authenticated
      if (isAuthenticated) {
        const saved = await saveToDatabase(cleaned);
        if (saved) {
          toast.success('✅ Resume saved to database successfully!');
        } else {
          toast.warning('Resume saved locally, but failed to save to database. Please try again.');
        }
      } else {
        // User not authenticated - saved locally only
        toast.info('Resume saved locally. Sign in to save permanently to database.');
      }

      setEditMode(false);
      setEditingSections({});
      setEditingHeader(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume. Please try again.');
    }
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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

<<<<<<< HEAD
  const removeEducation = (index) => {
    setLocalData({
      ...localData,
      education: (localData.education || []).filter((_, i) => i !== index),
    });
=======
  const handleContentChange = (section, value, field = null, id = null) => {
    let updatedData;

    if (section === 'header') {
      updatedData = {
        ...localData,
        [field]: value
      };
      setLocalData(updatedData);
    } else if (section === 'summary') {
      updatedData = {
        ...localData,
        summary: value
      };
      setLocalData(updatedData);
    } else if (id !== null && Array.isArray(localData[section])) {
      const updatedContent = localData[section].map(item => {
        if (item && typeof item === 'object' && item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      updatedData = { ...localData, [section]: updatedContent };
      setLocalData(updatedData);
    } else {
      return;
    }

    // Save to localStorage via context immediately
    if (updateResumeData) {
      updateResumeData(updatedData);
    }

    // Trigger debounced database save
    if (isAuthenticated && editMode) {
      debouncedAutoSave(updatedData);
    }
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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

<<<<<<< HEAD
        {/* Main Content */}
        <div className="main-content" style={{ flex: 1, padding: "3rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
          {/* Resume Container - MINIMALIST SINGLE COLUMN */}
=======
        <div style={{
          flexGrow: 1,
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto"
        }}>
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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
<<<<<<< HEAD
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
=======
            {showSuccessMessage && <SuccessMessage />}
            {isAutoSaving && (
              <div style={{
                position: "fixed",
                bottom: "1rem",
                left: "1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 1000,
                fontSize: "0.875rem"
              }}>
                Auto-saving...
              </div>
            )}

            {sections.map((sectionName) => {
              switch (sectionName) {
                case 'header':
                  return (
                    <header key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "2rem"
                    }}>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "1rem"
                      }}>
                        <div style={{ flex: 1 }}>
                          {editMode ? (
                            <>
                              <input
                                style={{
                                  fontSize: "3rem",
                                  fontWeight: "bold",
                                  width: "100%",
                                  marginBottom: "0.5rem",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.name || ''}
                                onChange={(e) => handleContentChange('header', e.target.value, 'name')}
                              />
                              <input
                                style={{
                                  fontSize: "1.125rem",
                                  color: "#6b7280",
                                  width: "100%",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.role || ''}
                                onChange={(e) => handleContentChange('header', e.target.value, 'role')}
                              />
                            </>
                          ) : (
                            <>
                              <h1 style={{ fontSize: "3rem", fontWeight: "bold", margin: "0" }}>{localData.name || ''}</h1>
                              <p style={{ fontSize: "1.125rem", color: "#6b7280", margin: "0" }}>{localData.role || ''}</p>
                            </>
                          )}
                        </div>
                        <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                          {editMode ? (
                            <>
                              <input
                                style={{
                                  display: "block",
                                  width: "100%",
                                  marginBottom: "0.25rem",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.phone || ''}
                                onChange={(e) => handleContentChange('header', e.target.value, 'phone')}
                              />
                              <input
                                style={{
                                  display: "block",
                                  width: "100%",
                                  marginBottom: "0.25rem",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.email || ''}
                                onChange={(e) => handleContentChange('header', e.target.value, 'email')}
                              />
                              <input
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "0.25rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  backgroundColor: "#fff"
                                }}
                                value={localData.location || ''}
                                onChange={(e) => handleContentChange('header', e.target.value, 'location')}
                              />
                            </>
                          ) : (
                            <>
                              {localData.phone && <div style={{ marginBottom: "0.25rem" }}>{localData.phone}</div>}
                              {localData.email && <div style={{ marginBottom: "0.25rem" }}><a href={`mailto:${localData.email}`} style={{ color: "inherit", textDecoration: "none" }}>{localData.email}</a></div>}
                              {localData.location && <div style={{ marginBottom: "0.25rem" }}>{localData.location}</div>}
                              {localData.linkedin && <div style={{ marginBottom: "0.25rem" }}><a href={localData.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>LinkedIn</a></div>}
                              {localData.github && <div style={{ marginBottom: "0.25rem" }}><a href={localData.github} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>GitHub</a></div>}
                              {localData.portfolio && <div><a href={localData.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>Portfolio</a></div>}
                            </>
                          )}
                        </div>
                      </div>
                    </header>
                  );

                case 'summary':
                  return (editMode || isFilled(localData.summary)) && (
                    <section key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Summary</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="summary" />
                      {editMode ? (
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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
<<<<<<< HEAD
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
=======
                      ) : (
                        <p style={{ color: "#374151" }}>{localData.summary || ''}</p>
                      )}
                    </section>
                  );

                case 'experience':
                  return (editMode || isFilled(localData.experience)) && (
                    <section key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Experience</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="experience" />
                      {(localData.experience || []).map((exp, idx) => {
                        if (!exp || typeof exp !== 'object') return null;
                        const accomplishment = Array.isArray(exp.accomplishment) ? exp.accomplishment : [];
                        return (
                          <div key={exp.id || idx} style={{
                            marginBottom: "1.5rem",
                            position: "relative",
                            border: "1px solid #e5e7eb",
                            padding: "1rem",
                            borderRadius: "0.5rem"
                          }}>
                            <div style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.5rem"
                            }}>
                              {editMode ? (
                                <>
                                  <input
                                    style={{
                                      fontSize: "1.25rem",
                                      fontWeight: "600",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      marginBottom: "0.5rem",
                                      width: "100%",
                                      backgroundColor: "#fff"
                                    }}
                                    value={exp.title || ''}
                                    onChange={(e) => handleArrayFieldChange('experience', idx, 'title', e.target.value)}
                                  />
                                  <input
                                    style={{
                                      color: "#6b7280",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      width: "100%",
                                      marginBottom: "0.5rem",
                                      backgroundColor: "#fff"
                                    }}
                                    value={exp.companyName || ''}
                                    onChange={(e) => handleArrayFieldChange('experience', idx, 'companyName', e.target.value)}
                                  />
                                  <input
                                    style={{
                                      color: "#6b7280",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      width: "100%",
                                      marginBottom: "0.5rem",
                                      backgroundColor: "#fff"
                                    }}
                                    value={exp.date || ''}
                                    onChange={(e) => handleArrayFieldChange('experience', idx, 'date', e.target.value)}
                                  />
                                  <input
                                    style={{
                                      color: "#6b7280",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      width: "100%",
                                      backgroundColor: "#fff"
                                    }}
                                    value={exp.companyLocation || ''}
                                    onChange={(e) => handleArrayFieldChange('experience', idx, 'companyLocation', e.target.value)}
                                  />
                                </>
                              ) : (
                                <>
                                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>{exp.title || ''}</h3>
                                  <span style={{ color: "#6b7280" }}>
                                    {exp.companyName || ''} {exp.date ? `(${exp.date})` : ''} {exp.companyLocation ? `- ${exp.companyLocation}` : ''}
                                  </span>
                                </>
                              )}
                            </div>
                            {editMode ? (
                              <textarea
                                style={{
                                  width: "100%",
                                  padding: "0.5rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.25rem",
                                  marginTop: "0.5rem",
                                  backgroundColor: "#fff",
                                  minHeight: "3rem",
                                  resize: "vertical"
                                }}
                                value={accomplishment.join('\n')}
                                onChange={(e) => handleArrayFieldChange('experience', idx, 'accomplishment', e.target.value.split('\n').filter(a => a.trim()))}
                                rows={3}
                              />
                            ) : (
                              accomplishment.length > 0 && (
                                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                                  {accomplishment.map((a, i) => (
                                    <li key={i} style={{ color: "#374151" }}>{a}</li>
                                  ))}
                                </ul>
                              )
                            )}
                            <button
                              onClick={() => handleDelete('experience', exp.id || idx)}
                              style={{
                                position: "absolute",
                                top: "0.5rem",
                                right: "0.5rem",
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                display: editMode ? "block" : "none",
                                padding: "0.25rem"
                              }}
                              title="Delete this experience"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </section>
                  );

                case 'achievements':
                  return (editMode || isFilled(localData.achievements)) && (
                    <section key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Achievements</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="achievements" />
                      {editMode ? (
                        <div>
                          {(localData.achievements || []).map((achievement, idx) => {
                            const achievementText = typeof achievement === 'string'
                              ? achievement
                              : (achievement?.title || achievement?.description || achievement?.name || '');

                            return (
                              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <textarea
                                  style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.25rem",
                                    backgroundColor: "#fff",
                                    minHeight: "2rem",
                                    resize: "vertical"
                                  }}
                                  value={achievementText}
                                  onChange={(e) => {
                                    const updatedAchievements = [...(localData.achievements || [])];
                                    updatedAchievements[idx] = e.target.value;
                                    handleFieldChange('achievements', updatedAchievements);
                                  }}
                                  rows={1}
                                />
                                <button
                                  onClick={() => {
                                    const updatedAchievements = (localData.achievements || []).filter((_, index) => index !== idx);
                                    handleFieldChange('achievements', updatedAchievements);
                                  }}
                                  style={{
                                    color: "#ef4444",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: "0.25rem"
                                  }}
                                  title="Delete this achievement"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <ul style={{ paddingLeft: "1.25rem" }}>
                          {(localData.achievements || []).map((item, i) => {
                            const achievementText = typeof item === 'string'
                              ? item
                              : (item?.title || item?.description || item?.name || '');

                            return achievementText ? (
                              <li key={i} style={{ color: "#374151" }}>{achievementText}</li>
                            ) : null;
                          })}
                        </ul>
                      )}
                    </section>
                  );

                case 'projects':
                  return (editMode || isFilled(localData.projects)) && (
                    <section key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Projects</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="projects" />
                      {(localData.projects || []).map((proj, idx) => {
                        if (!proj || typeof proj !== 'object') return null;
                        const technologies = Array.isArray(proj.technologies) ? proj.technologies : [];
                        return (
                          <div key={proj.id || idx} style={{
                            marginBottom: "1.5rem",
                            position: "relative",
                            border: "1px solid #e5e7eb",
                            padding: "1rem",
                            borderRadius: "0.5rem"
                          }}>
                            <div style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "0.5rem"
                            }}>
                              {editMode ? (
                                <>
                                  <input
                                    style={{
                                      fontSize: "1.25rem",
                                      fontWeight: "600",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      padding: "0.5rem",
                                      marginBottom: "0.5rem",
                                      width: "100%",
                                      backgroundColor: "#fff"
                                    }}
                                    value={proj.name || ''}
                                    onChange={(e) => handleArrayFieldChange('projects', idx, 'name', e.target.value)}
                                  />
                                  <textarea
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      marginTop: "0.5rem",
                                      marginBottom: "0.5rem",
                                      backgroundColor: "#fff",
                                      minHeight: "3rem",
                                      resize: "vertical"
                                    }}
                                    value={proj.description || ''}
                                    onChange={(e) => handleArrayFieldChange('projects', idx, 'description', e.target.value)}
                                    rows={3}
                                  />
                                  <input
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      backgroundColor: "#fff",
                                      marginBottom: "0.5rem"
                                    }}
                                    value={technologies.join(', ')}
                                    onChange={(e) => handleArrayFieldChange('projects', idx, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                    placeholder="Technologies used"
                                  />
                                  <input
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      backgroundColor: "#fff",
                                      marginBottom: "0.5rem"
                                    }}
                                    value={proj.link || ''}
                                    onChange={(e) => handleArrayFieldChange('projects', idx, 'link', e.target.value)}
                                    placeholder="Live Link"
                                  />
                                  <input
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #d1d5db",
                                      borderRadius: "0.25rem",
                                      backgroundColor: "#fff"
                                    }}
                                    value={proj.github || ''}
                                    onChange={(e) => handleArrayFieldChange('projects', idx, 'github', e.target.value)}
                                    placeholder="GitHub Link"
                                  />
                                </>
                              ) : (
                                <>
                                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>{proj.name || ''}</h3>
                                  {proj.description && <p style={{ color: "#374151", marginTop: "0.5rem" }}>{proj.description}</p>}
                                  {technologies.length > 0 && (
                                    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                                      <span style={{ fontWeight: "500" }}>Technologies:</span> {technologies.join(', ')}
                                    </p>
                                  )}
                                  {(proj.link || proj.github) && (
                                    <p style={{ marginTop: "0.5rem" }}>
                                      {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", marginRight: "1rem" }}>Live</a>}
                                      {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>GitHub</a>}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                            <button
                              onClick={() => handleDelete('projects', proj.id || idx)}
                              style={{
                                position: "absolute",
                                top: "0.5rem",
                                right: "0.5rem",
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                display: editMode ? "block" : "none",
                                padding: "0.25rem"
                              }}
                              title="Delete this project"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </section>
                  );

                case 'education':
                  return (editMode || isFilled(localData.education)) && (
                    <section key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "0 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Education</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="education" />
                      {(localData.education || []).map((edu, idx) => {
                        if (!edu || typeof edu !== 'object') return null;
                        return (
                          <div key={edu.id || idx} style={{
                            marginBottom: "1rem",
                            position: "relative",
                            border: "1px solid #e5e7eb",
                            padding: "1rem",
                            borderRadius: "0.5rem"
                          }}>
                            <div style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              alignItems: "flex-start"
                            }}>
                              <div style={{ flex: 1 }}>
                                {editMode ? (
                                  <>
                                    <input
                                      style={{
                                        fontSize: "1.25rem",
                                        fontWeight: "600",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.25rem",
                                        padding: "0.5rem",
                                        marginBottom: "0.5rem",
                                        width: "100%",
                                        backgroundColor: "#fff"
                                      }}
                                      value={edu.institution || ''}
                                      onChange={(e) => handleArrayFieldChange('education', idx, 'institution', e.target.value)}
                                    />
                                    <input
                                      style={{
                                        color: "#374151",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.25rem",
                                        padding: "0.5rem",
                                        width: "100%",
                                        backgroundColor: "#fff"
                                      }}
                                      value={edu.degree || ''}
                                      onChange={(e) => handleArrayFieldChange('education', idx, 'degree', e.target.value)}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", margin: "0" }}>{edu.institution || ''}</h3>
                                    <p style={{ color: "#374151", margin: "0" }}>{edu.degree || ''}</p>
                                  </>
                                )}
                              </div>
                              <div style={{ marginTop: "0.5rem" }}>
                                {editMode ? (
                                  <>
                                    <input
                                      style={{
                                        color: "#6b7280",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.25rem",
                                        padding: "0.5rem",
                                        width: "100%",
                                        marginBottom: "0.5rem",
                                        backgroundColor: "#fff"
                                      }}
                                      value={edu.duration || ''}
                                      onChange={(e) => handleArrayFieldChange('education', idx, 'duration', e.target.value)}
                                    />
                                    <input
                                      style={{
                                        color: "#6b7280",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "0.25rem",
                                        padding: "0.5rem",
                                        width: "100%",
                                        backgroundColor: "#fff"
                                      }}
                                      value={edu.location || ''}
                                      onChange={(e) => handleArrayFieldChange('education', idx, 'location', e.target.value)}
                                    />
                                  </>
                                ) : (
                                  <span style={{ color: "#6b7280" }}>
                                    {edu.duration || ''} {edu.duration && edu.location ? '- ' : ''}{edu.location || ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDelete('education', edu.id || idx)}
                              style={{
                                position: "absolute",
                                top: "0.5rem",
                                right: "0.5rem",
                                color: "#ef4444",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                display: editMode ? "block" : "none",
                                padding: "0.25rem"
                              }}
                              title="Delete this education"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        );
                      })}
                    </section>
                  );

                case 'skills':
                  return (editMode || isFilled(localData.skills) || isFilled(localData.languages) || isFilled(localData.interests)) && (
                    <section key={sectionName} style={{
                      marginBottom: "2rem",
                      position: "relative",
                      padding: "0 2rem 2rem 2rem"
                    }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>Skills</h2>
                      <div style={{ borderBottom: "1px solid #d1d5db", marginBottom: "2rem" }}></div>
                      <SectionButtons section="skills" />

                      {/* Technical Skills */}
                      <div style={{ marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Technical Skills:</h3>
                        {editMode ? (
                          <input
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.25rem",
                              backgroundColor: "#fff"
                            }}
                            value={(localData.skills || []).join(', ')}
                            onChange={(e) => handleFieldChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          />
                        ) : (
                          <p style={{ color: "#374151" }}>{(localData.skills || []).length > 0 ? (localData.skills || []).join(' • ') : 'No skills listed'}</p>
                        )}
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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
<<<<<<< HEAD
            marginTop: "2rem",
=======
            marginTop: "1rem",
>>>>>>> bd345cc92daab7ed81828d5d482159e12f0d7cbf
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
