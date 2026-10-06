import { useState, useEffect, useRef } from "react";

import "./Profile.css";

function Profile({ user, onBack }) {

  // ==========================================
  // RESUME STATE
  // ==========================================

  const resumeInputRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [resumeMessage, setResumeMessage] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);


  // ==========================================
  // KEY SKILLS STATE
  // ==========================================

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);


  // ==========================================
  // EXPERIENCE STATE
  // ==========================================

  const [experiences, setExperiences] = useState([]);

  const [showExperienceForm, setShowExperienceForm] =
    useState(false);

  const [editingExperienceId, setEditingExperienceId] =
    useState(null);

  const [savingExperience, setSavingExperience] =
    useState(false);

  const [experienceMessage, setExperienceMessage] =
    useState("");

  const [experienceForm, setExperienceForm] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: ""
  });


  // ==========================================
  // RESUME HEADLINE STATE
  // ==========================================

  const [resumeHeadline, setResumeHeadline] = useState("");
  const [editingHeadline, setEditingHeadline] = useState(false);
  const [savingHeadline, setSavingHeadline] = useState(false);
  const [headlineMessage, setHeadlineMessage] = useState("");


  // ==========================================
  // PERSONAL DETAILS STATE
  // ==========================================

  const [editingPersonal, setEditingPersonal] = useState(false);

  const [personal, setPersonal] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    dateOfBirth: user?.dateOfBirth || "",
    linkedin: user?.linkedin || "",
    github: user?.github || ""
  });

  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");


  // ==========================================
  // DEBUG USER
  // ==========================================

  console.log("USER:", user);
  console.log("USER ID:", user?.id);


  // ==========================================
  // LOAD PROFILE FROM DATABASE
  // ==========================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/profile/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        console.log(
          "Profile loaded from database:",
          data
        );

        setPersonal({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          dateOfBirth: data.dateOfBirth || "",
          linkedin: data.linkedin || "",
          github: data.github || ""
        });

        setResumeHeadline(data.resumeHeadline || "");

      } catch (error) {

        console.error(
          "Could not load profile:",
          error
        );

      }

    };

    if (user?.id) {
      loadProfile();
    }

  }, [user]);


  // ==========================================
  // LOAD RESUME FROM DATABASE
  // ==========================================

  useEffect(() => {

    const loadResume = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/resume/${user.id}`
        );

        if (response.status === 204) {
          setResume(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load resume");
        }

        const data = await response.json();

        console.log(
          "Resume loaded from database:",
          data
        );

        setResume(data);

      } catch (error) {

        console.error(
          "Could not load resume:",
          error
        );

      }

    };

    if (user?.id) {
      loadResume();
    }

  }, [user]);


  // ==========================================
  // LOAD SKILLS FROM DATABASE
  // ==========================================

  useEffect(() => {

    const loadSkills = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/skills/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load skills");
        }

        const data = await response.json();

        console.log(
          "Skills loaded from database:",
          data
        );

        setSkills(data);

      } catch (error) {

        console.error(
          "Could not load skills:",
          error
        );

      }

    };

    if (user?.id) {
      loadSkills();
    }

  }, [user]);


  // ==========================================
  // LOAD EXPERIENCES FROM DATABASE
  // ==========================================

  useEffect(() => {

    const loadExperiences = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/experience/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load experiences");
        }

        const data = await response.json();

        console.log(
          "Experiences loaded:",
          data
        );

        setExperiences(data);

      } catch (error) {

        console.error(
          "Could not load experiences:",
          error
        );

      }

    };

    if (user?.id) {
      loadExperiences();
    }

  }, [user]);


  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleAddSkill = async () => {

    const skillName = newSkill.trim();

    if (!skillName) {

      alert("Please enter a skill");

      return;
    }

    setAddingSkill(true);

    try {

      const response = await fetch(
        `http://localhost:8080/skills/${user.id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: skillName
          })
        }
      );

      const data = await response.json();

      console.log(
        "Add skill response:",
        data
      );

      if (!response.ok) {

        throw new Error(
          data || "Failed to add skill"
        );

      }

      setSkills((prevSkills) => [
        ...prevSkills,
        data
      ]);

      setNewSkill("");

    } catch (error) {

      console.error(
        "Add skill error:",
        error
      );

      alert("Could not add skill");

    } finally {

      setAddingSkill(false);

    }

  };


  // ==========================================
  // EXPERIENCE FUNCTIONS
  // ==========================================

  const handleExperienceInputChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setExperienceForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

  };


  // ==========================================
  // OPEN ADD EXPERIENCE FORM
  // ==========================================

  const handleAddExperienceClick = () => {

    setEditingExperienceId(null);

    setExperienceForm({
      jobTitle: "",
      companyName: "",
      location: "",
      employmentType: "Full-time",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: ""
    });

    setExperienceMessage("");

    setShowExperienceForm(true);

  };


  // ==========================================
  // EDIT EXPERIENCE
  // ==========================================

  const handleEditExperience = (experience) => {

    setEditingExperienceId(experience.id);

    setExperienceForm({
      jobTitle: experience.jobTitle || "",
      companyName: experience.companyName || "",
      location: experience.location || "",
      employmentType:
        experience.employmentType || "Full-time",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      currentlyWorking:
        experience.currentlyWorking || false,
      description:
        experience.description || ""
    });

    setExperienceMessage("");

    setShowExperienceForm(true);

  };


  // ==========================================
  // CANCEL EXPERIENCE FORM
  // ==========================================

  const handleCancelExperience = () => {

    setShowExperienceForm(false);

    setEditingExperienceId(null);

    setExperienceMessage("");

  };


  // ==========================================
  // SAVE / UPDATE EXPERIENCE
  // ==========================================

  const handleSaveExperience = async () => {

    if (!experienceForm.jobTitle.trim()) {

      setExperienceMessage(
        "Job title is required"
      );

      return;
    }

    if (!experienceForm.companyName.trim()) {

      setExperienceMessage(
        "Company name is required"
      );

      return;
    }

    if (!experienceForm.startDate) {

      setExperienceMessage(
        "Start date is required"
      );

      return;
    }

    if (
      !experienceForm.currentlyWorking &&
      !experienceForm.endDate
    ) {

      setExperienceMessage(
        "End date is required unless currently working"
      );

      return;
    }

    setSavingExperience(true);

    setExperienceMessage("");

    try {

      const isEditing =
        editingExperienceId !== null;

      const url = isEditing
        ? `http://localhost:8080/experience/${user.id}/${editingExperienceId}`
        : `http://localhost:8080/experience/${user.id}`;

      const response = await fetch(url, {

        method: isEditing
          ? "PUT"
          : "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(
          experienceForm
        )

      });

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          typeof data === "string"
            ? data
            : "Failed to save experience"
        );

      }

      if (isEditing) {

        setExperiences((prev) =>
          prev.map((experience) =>
            experience.id ===
            editingExperienceId
              ? data
              : experience
          )
        );

      } else {

        setExperiences((prev) => [
          ...prev,
          data
        ]);

      }

      setShowExperienceForm(false);

      setEditingExperienceId(null);

      setExperienceMessage("");

    } catch (error) {

      console.error(
        "Experience save error:",
        error
      );

      setExperienceMessage(
        error.message ||
        "Could not save experience"
      );

    } finally {

      setSavingExperience(false);

    }

  };


  // ==========================================
  // DELETE EXPERIENCE
  // ==========================================

  const handleDeleteExperience = async (
    experienceId
  ) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/experience/${user.id}/${experienceId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to delete experience"
        );

      }

      setExperiences((prev) =>
        prev.filter(
          (experience) =>
            experience.id !== experienceId
        )
      );

    } catch (error) {

      console.error(
        "Delete experience error:",
        error
      );

      alert(
        "Could not delete experience"
      );

    }

  };


  // ==========================================
  // SAVE RESUME HEADLINE
  // ==========================================

  const handleHeadlineSave = async () => {

    const headline =
      resumeHeadline.trim();

    if (!headline) {

      alert(
        "Please enter a resume headline"
      );

      return;
    }

    setSavingHeadline(true);

    setHeadlineMessage("");

    try {

      const response = await fetch(
        `http://localhost:8080/profile/${user.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username: personal.username,
            email: personal.email,
            phone: personal.phone,
            location: personal.location,
            dateOfBirth: personal.dateOfBirth,
            linkedin: personal.linkedin,
            github: personal.github,
            resumeHeadline: headline
          })
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to save headline"
        );

      }

      const updatedUser =
        await response.json();

      setResumeHeadline(
        updatedUser.resumeHeadline ||
        headline
      );

      setEditingHeadline(false);

      setHeadlineMessage(
        "Resume headline updated successfully!"
      );

    } catch (error) {

      console.error(
        "Headline save error:",
        error
      );

      setHeadlineMessage(
        "Could not update resume headline."
      );

    } finally {

      setSavingHeadline(false);

    }

  };


  // ==========================================
  // DELETE SKILL
  // ==========================================

  const handleDeleteSkill = async (
    skillId
  ) => {

    try {

      const response = await fetch(
        `http://localhost:8080/skills/${skillId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to delete skill"
        );

      }

      setSkills((prevSkills) =>
        prevSkills.filter(
          (skill) =>
            skill.id !== skillId
        )
      );

    } catch (error) {

      console.error(
        "Delete skill error:",
        error
      );

      alert(
        "Could not delete skill"
      );

    }

  };


  // ==========================================
  // RESUME UPLOAD
  // ==========================================

  const handleResumeUpload = async (
    event
  ) => {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }


    // Show selected file immediately

    setResume({
      fileName: file.name
    });

    setResumeMessage(
      `Selected: ${file.name}`
    );


    // Allowed file types

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];


    if (!allowedTypes.includes(file.type)) {

      setResumeMessage(
        "Please upload a PDF, DOC, or DOCX file."
      );

      return;
    }


    setUploadingResume(true);


    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );


      console.log(
        "Uploading file:",
        file.name
      );

      console.log(
        "User ID:",
        user.id
      );


      const response = await fetch(
        `http://localhost:8080/resume/${user.id}`,
        {
          method: "POST",
          body: formData
        }
      );


      console.log(
        "Upload response:",
        response.status
      );


      if (!response.ok) {

        const errorText =
          await response.text();

        console.error(
          "Backend upload error:",
          errorText
        );

        throw new Error(
          errorText
        );

      }


      const data =
        await response.json();


      console.log(
        "Resume uploaded successfully:",
        data
      );


      setResume(data);

      setResumeMessage(
        "Resume uploaded successfully!"
      );


    } catch (error) {

      console.error(
        "Resume upload error:",
        error
      );

      setResumeMessage(
        "Could not upload resume."
      );


    } finally {

      setUploadingResume(false);

      event.target.value = "";

    }

  };


  // ==========================================
  // PERSONAL DETAILS SAVE
  // ==========================================

  const handlePersonalSave = async () => {

    setSaving(true);

    setProfileMessage("");


    console.log(
      "User ID:",
      user.id
    );

    console.log(
      "Personal data being sent:",
      personal
    );


    try {

      const response = await fetch(
        `http://localhost:8080/profile/${user.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(
            personal
          )
        }
      );


      console.log(
        "Response status:",
        response.status
      );


      if (!response.ok) {

        throw new Error(
          "Failed to update profile"
        );

      }


      const updatedUser =
        await response.json();


      console.log(
        "Updated user:",
        updatedUser
      );


      setPersonal({

        username:
          updatedUser.username || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || "",

        location:
          updatedUser.location || "",

        dateOfBirth:
          updatedUser.dateOfBirth || "",

        linkedin:
          updatedUser.linkedin || "",

        github:
          updatedUser.github || ""

      });


      setResumeHeadline(
        updatedUser.resumeHeadline ||
        resumeHeadline
      );


      setEditingPersonal(false);


      setProfileMessage(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "Profile update error:",
        error
      );


      setProfileMessage(
        "Could not update profile."
      );


    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // QUICK LINK SCROLL
  // ==========================================

  const scrollToSection = (id) => {

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="cv-profile-page">


      {/* =====================================
          HEADER
          ===================================== */}

      <div className="cv-profile-header">

        <button
          className="cv-profile-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>


        <h1>
          My Profile
        </h1>

      </div>


      {/* =====================================
          MAIN CONTAINER
          ===================================== */}

      <div className="cv-profile-container">


        {/* =====================================
            PROFILE HERO
            ===================================== */}

        <div className="cv-profile-hero">


          <div className="cv-profile-avatar">

            {personal.username
              ?.charAt(0)
              .toUpperCase()}

          </div>


          <div className="cv-profile-info">

            <h2>
              {personal.username ||
                "Your Name"}
            </h2>

            <p>
              {personal.email ||
                "your@email.com"}
            </p>

            <strong>
              🚀 Build your professional profile
            </strong>

          </div>


          <div className="cv-profile-completion">

            <div className="cv-profile-completion-title">

              <span>
                Profile Completion
              </span>

              <b>
                20%
              </b>

            </div>


            <div className="cv-profile-progress">

              <div></div>

            </div>


            <p>
              Complete your profile to stand out to recruiters.
            </p>

          </div>

        </div>


        {/* =====================================
            BODY
            ===================================== */}

        <div className="cv-profile-body">


          {/* =====================================
              QUICK LINKS
              ===================================== */}

          <aside className="cv-profile-menu">

            <h3>
              Quick Links
            </h3>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-resume")
              }
            >
              📄 Resume
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-headline")
              }
            >
              📝 Resume Headline
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-skills")
              }
            >
              🛠 Key Skills
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-experience")
              }
            >
              💼 Experience
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-education")
              }
            >
              🎓 Education
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-projects")
              }
            >
              🚀 Projects
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-summary")
              }
            >
              ✍️ Profile Summary
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-achievements")
              }
            >
              🏆 Achievements
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-preferences")
              }
            >
              🎯 Career Preferences
            </button>


            <button
              type="button"
              onClick={() =>
                scrollToSection("cv-personal")
              }
            >
              👤 Personal Details
            </button>

          </aside>


          {/* =====================================
              CONTENT
              ===================================== */}

          <div className="cv-profile-content">


            {/* =====================================
                RESUME
                ===================================== */}

            <div
              id="cv-resume"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Resume
                  </h2>

                  <p>
                    Upload your latest resume.
                  </p>

                </div>

                <span>
                  ✏️
                </span>

              </div>


              <div className="cv-resume-box">

                <div className="cv-resume-icon">
                  📄
                </div>


                {!resume ? (

                  <>

                    <h3>
                      Upload your resume
                    </h3>

                    <p>
                      PDF, DOC or DOCX files supported
                    </p>

                  </>

                ) : (

                  <>

                    <h3>
                      Resume Uploaded
                    </h3>

                    <p>
                      Your current resume:
                    </p>

                  </>

                )}


                {/* HIDDEN FILE INPUT */}

                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{
                    display: "none"
                  }}
                  onChange={
                    handleResumeUpload
                  }
                />


                {/* UPLOAD BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    resumeInputRef.current?.click()
                  }
                  disabled={
                    uploadingResume
                  }
                >

                  {uploadingResume
                    ? "Uploading..."
                    : resume
                      ? "Replace Resume"
                      : "Upload Resume"}

                </button>


                {/* MESSAGE */}

                {resumeMessage && (

                  <p className="cv-resume-message">

                    {resumeMessage}

                  </p>

                )}


                {/* FILE NAME */}

                {resume && (

                  <div className="cv-resume-info">

                    <span>
                      📄
                    </span>

                    <strong>
                      {resume.fileName}
                    </strong>

                  </div>

                )}

              </div>

            </div>


            {/* =====================================
                RESUME HEADLINE
                ===================================== */}

            <div
              id="cv-headline"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Resume Headline
                  </h2>

                  <p>
                    A short professional headline.
                  </p>

                </div>

                {!editingHeadline && (

                  <button
                    type="button"
                    onClick={() => {

                      setEditingHeadline(true);

                      setHeadlineMessage("");

                    }}
                  >
                    ✏️ Edit
                  </button>

                )}

              </div>


              {!editingHeadline ? (

                <>

                  <div className="cv-headline-display">

                    {resumeHeadline ? (

                      <strong>
                        {resumeHeadline}
                      </strong>

                    ) : (

                      <span>
                        Add a professional headline to introduce yourself.
                      </span>

                    )}

                  </div>


                  {headlineMessage && (

                    <div className="cv-profile-success">
                      {headlineMessage}
                    </div>

                  )}

                </>

              ) : (

                <div className="cv-headline-edit">

                  <label>
                    Resume Headline
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Java Developer | Spring Boot | React | MySQL"
                    value={resumeHeadline}
                    onChange={(e) =>
                      setResumeHeadline(
                        e.target.value
                      )
                    }
                    maxLength={150}
                  />

                  <small>
                    Keep it short and professional. Maximum 150 characters.
                  </small>


                  <div className="cv-form-buttons">

                    <button
                      type="button"
                      className="cv-cancel-button"
                      onClick={() => {

                        setEditingHeadline(false);

                        setHeadlineMessage("");

                      }}
                    >
                      Cancel
                    </button>


                    <button
                      type="button"
                      className="cv-save-button"
                      onClick={
                        handleHeadlineSave
                      }
                      disabled={
                        savingHeadline
                      }
                    >

                      {savingHeadline
                        ? "Saving..."
                        : "Save Headline"}

                    </button>

                  </div>


                  {headlineMessage && (

                    <div className="cv-profile-error">
                      {headlineMessage}
                    </div>

                  )}

                </div>

              )}

            </div>


            {/* =====================================
                KEY SKILLS
                ===================================== */}

            <div
              id="cv-skills"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Key Skills
                  </h2>

                  <p>
                    Technologies and skills you know.
                  </p>

                </div>

              </div>


              {/* ADD SKILL */}

              <div className="cv-add-skill">

                <input
                  type="text"
                  placeholder="Enter a skill e.g. Java"
                  value={newSkill}
                  onChange={(e) =>
                    setNewSkill(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

                    if (e.key === "Enter") {
                      handleAddSkill();
                    }

                  }}
                />


                <button
                  type="button"
                  onClick={
                    handleAddSkill
                  }
                  disabled={
                    addingSkill
                  }
                >

                  {addingSkill
                    ? "Adding..."
                    : "Save Skill"}

                </button>

              </div>


              {/* SKILLS */}

              <div className="cv-skill-list">

                {skills.length === 0 ? (

                  <p className="cv-no-skills">
                    No skills added yet.
                  </p>

                ) : (

                  skills.map((skill) => (

                    <span
                      className="cv-skill-tag"
                      key={skill.id}
                    >

                      {skill.name}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSkill(
                            skill.id
                          )
                        }
                        title="Delete skill"
                      >
                        ×
                      </button>

                    </span>

                  ))

                )}

              </div>

            </div>


            {/* =====================================
                EXPERIENCE
                ===================================== */}

            <div
              id="cv-experience"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Experience
                  </h2>

                  <p>
                    Add your professional experience.
                  </p>

                </div>


                {!showExperienceForm && (

                  <button
                    type="button"
                    onClick={
                      handleAddExperienceClick
                    }
                  >
                    + Add Experience
                  </button>

                )}

              </div>


              {/* =====================================
                  EXPERIENCE FORM
                  ===================================== */}

              {showExperienceForm && (

                <div className="cv-experience-form">

                  <h3>
                    {editingExperienceId !== null
                      ? "Edit Experience"
                      : "Add Experience"}
                  </h3>


                  <div className="cv-experience-grid">


                    {/* JOB TITLE */}

                    <div className="cv-form-field">

                      <label>
                        Job Title *
                      </label>

                      <input
                        type="text"
                        name="jobTitle"
                        placeholder="Example: Software Developer"
                        value={
                          experienceForm.jobTitle
                        }
                        onChange={
                          handleExperienceInputChange
                        }
                      />

                    </div>


                    {/* COMPANY */}

                    <div className="cv-form-field">

                      <label>
                        Company Name *
                      </label>

                      <input
                        type="text"
                        name="companyName"
                        placeholder="Example: ABC Technologies"
                        value={
                          experienceForm.companyName
                        }
                        onChange={
                          handleExperienceInputChange
                        }
                      />

                    </div>


                    {/* LOCATION */}

                    <div className="cv-form-field">

                      <label>
                        Location
                      </label>

                      <input
                        type="text"
                        name="location"
                        placeholder="Example: Pune, Maharashtra"
                        value={
                          experienceForm.location
                        }
                        onChange={
                          handleExperienceInputChange
                        }
                      />

                    </div>


                    {/* EMPLOYMENT TYPE */}

                    <div className="cv-form-field">

                      <label>
                        Employment Type
                      </label>

                      <select
                        name="employmentType"
                        value={
                          experienceForm.employmentType
                        }
                        onChange={
                          handleExperienceInputChange
                        }
                      >

                        <option value="Full-time">
                          Full-time
                        </option>

                        <option value="Part-time">
                          Part-time
                        </option>

                        <option value="Internship">
                          Internship
                        </option>

                        <option value="Contract">
                          Contract
                        </option>

                        <option value="Freelance">
                          Freelance
                        </option>

                      </select>

                    </div>


                    {/* START DATE */}

                    <div className="cv-form-field">

                      <label>
                        Start Date *
                      </label>

                      <input
                        type="date"
                        name="startDate"
                        value={
                          experienceForm.startDate
                        }
                        onChange={
                          handleExperienceInputChange
                        }
                      />

                    </div>


                    {/* END DATE */}

                    <div className="cv-form-field">

                      <label>
                        End Date
                      </label>

                      <input
                        type="date"
                        name="endDate"
                        value={
                          experienceForm.endDate
                        }
                        onChange={
                          handleExperienceInputChange
                        }
                        disabled={
                          experienceForm.currentlyWorking
                        }
                      />

                    </div>

                  </div>


                  {/* CURRENTLY WORKING */}

                  <label className="cv-experience-current">

                    <input
                      type="checkbox"
                      name="currentlyWorking"
                      checked={
                        experienceForm.currentlyWorking
                      }
                      onChange={
                        handleExperienceInputChange
                      }
                    />

                    <span>
                      I currently work here
                    </span>

                  </label>


                  {/* DESCRIPTION */}

                  <div className="cv-form-field">

                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows="5"
                      placeholder="Describe your responsibilities, achievements and work..."
                      value={
                        experienceForm.description
                      }
                      onChange={
                        handleExperienceInputChange
                      }
                    />

                  </div>


                  {/* MESSAGE */}

                  {experienceMessage && (

                    <div className="cv-profile-error">
                      {experienceMessage}
                    </div>

                  )}


                  {/* BUTTONS */}

                  <div className="cv-form-buttons">

                    <button
                      type="button"
                      className="cv-cancel-button"
                      onClick={
                        handleCancelExperience
                      }
                      disabled={
                        savingExperience
                      }
                    >
                      Cancel
                    </button>


                    <button
                      type="button"
                      className="cv-save-button"
                      onClick={
                        handleSaveExperience
                      }
                      disabled={
                        savingExperience
                      }
                    >

                      {savingExperience
                        ? "Saving..."
                        : editingExperienceId !== null
                          ? "Update Experience"
                          : "Save Experience"}

                    </button>

                  </div>

                </div>

              )}


              {/* =====================================
                  EXPERIENCE LIST
                  ===================================== */}

              {!showExperienceForm && (

                <div className="cv-experience-list">

                  {experiences.length === 0 ? (

                    <div className="cv-empty-box">

                      <div>
                        💼
                      </div>

                      <h3>
                        No experience added yet
                      </h3>

                      <p>
                        Add your internship or work experience.
                      </p>

                    </div>

                  ) : (

                    experiences.map(
                      (experience) => (

                        <div
                          className="cv-experience-card"
                          key={experience.id}
                        >

                          <div className="cv-experience-card-header">

                            <div>

                              <h3>
                                {experience.jobTitle}
                              </h3>

                              <strong>
                                {experience.companyName}
                              </strong>

                            </div>


                            <div className="cv-experience-actions">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEditExperience(
                                    experience
                                  )
                                }
                              >
                                ✏️ Edit
                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteExperience(
                                    experience.id
                                  )
                                }
                              >
                                🗑 Delete
                              </button>

                            </div>

                          </div>


                          <div className="cv-experience-meta">

                            {experience.location && (

                              <span>
                                📍 {experience.location}
                              </span>

                            )}


                            {experience.employmentType && (

                              <span>
                                💼 {experience.employmentType}
                              </span>

                            )}


                            {experience.startDate && (

                              <span>

                                📅 {experience.startDate}

                                {" - "}

                                {experience.currentlyWorking
                                  ? "Present"
                                  : experience.endDate}

                              </span>

                            )}

                          </div>


                          {experience.description && (

                            <p className="cv-experience-description">
                              {experience.description}
                            </p>

                          )}

                        </div>

                      )
                    )

                  )}

                </div>

              )}

            </div>


            {/* =====================================
                EDUCATION
                ===================================== */}

            <div
              id="cv-education"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Education
                  </h2>

                  <p>
                    Add your educational qualifications.
                  </p>

                </div>

                <button
                  type="button"
                >
                  + Add Education
                </button>

              </div>


              <div className="cv-empty-box">

                <div>
                  🎓
                </div>

                <h3>
                  No education added yet
                </h3>

                <p>
                  Add your degree, college and graduation year.
                </p>

              </div>

            </div>


            {/* =====================================
                PROJECTS
                ===================================== */}

            <div
              id="cv-projects"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Projects
                  </h2>

                  <p>
                    Showcase your best projects.
                  </p>

                </div>

                <button
                  type="button"
                >
                  + Add Project
                </button>

              </div>


              <div className="cv-empty-box">

                <div>
                  🚀
                </div>

                <h3>
                  No projects added yet
                </h3>

                <p>
                  Add projects to showcase your technical skills.
                </p>

              </div>

            </div>


            {/* =====================================
                PROFILE SUMMARY
                ===================================== */}

            <div
              id="cv-summary"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Profile Summary
                  </h2>

                  <p>
                    Tell recruiters about yourself.
                  </p>

                </div>

                <span>
                  ✏️
                </span>

              </div>


              <div className="cv-summary-box">

                Add a professional summary describing your
                skills, experience, projects and career goals.

              </div>

            </div>


            {/* =====================================
                ACHIEVEMENTS
                ===================================== */}

            <div
              id="cv-achievements"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Achievements
                  </h2>

                  <p>
                    Highlight your accomplishments.
                  </p>

                </div>

                <button
                  type="button"
                >
                  + Add
                </button>

              </div>


              <div className="cv-empty-box">

                <div>
                  🏆
                </div>

                <h3>
                  Add your achievements
                </h3>

                <p>
                  Certifications, awards and other achievements.
                </p>

              </div>

            </div>


            {/* =====================================
                CAREER PREFERENCES
                ===================================== */}

            <div
              id="cv-preferences"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Career Preferences
                  </h2>

                  <p>
                    Tell us what opportunity you are looking for.
                  </p>

                </div>

                <span>
                  ✏️
                </span>

              </div>


              <div className="cv-preference-grid">

                <div>

                  <label>
                    Preferred Role
                  </label>

                  <strong>
                    Not added
                  </strong>

                </div>


                <div>

                  <label>
                    Preferred Location
                  </label>

                  <strong>
                    Not added
                  </strong>

                </div>


                <div>

                  <label>
                    Work Mode
                  </label>

                  <strong>
                    Not added
                  </strong>

                </div>


                <div>

                  <label>
                    Expected Salary
                  </label>

                  <strong>
                    Not added
                  </strong>

                </div>

              </div>

            </div>


            {/* =====================================
                PERSONAL DETAILS
                ===================================== */}

            <div
              id="cv-personal"
              className="cv-profile-section"
            >

              <div className="cv-section-title">

                <div>

                  <h2>
                    Personal Details
                  </h2>

                  <p>
                    Manage your basic personal information.
                  </p>

                </div>


                {!editingPersonal && (

                  <button
                    type="button"
                    onClick={() => {

                      setEditingPersonal(true);

                      setProfileMessage("");

                    }}
                  >
                    ✏️ Edit
                  </button>

                )}

              </div>


              {/* ==================================
                  VIEW MODE
                  ================================== */}

              {!editingPersonal ? (

                <>

                  <div className="cv-personal-grid">


                    <div>

                      <label>
                        Full Name
                      </label>

                      <strong>
                        {personal.username ||
                          "Not added"}
                      </strong>

                    </div>


                    <div>

                      <label>
                        Email Address
                      </label>

                      <strong>
                        {personal.email ||
                          "Not added"}
                      </strong>

                    </div>


                    <div>

                      <label>
                        Phone Number
                      </label>

                      <strong>
                        {personal.phone ||
                          "Not added"}
                      </strong>

                    </div>


                    <div>

                      <label>
                        Location
                      </label>

                      <strong>
                        {personal.location ||
                          "Not added"}
                      </strong>

                    </div>


                    <div>

                      <label>
                        Date of Birth
                      </label>

                      <strong>
                        {personal.dateOfBirth ||
                          "Not added"}
                      </strong>

                    </div>


                    <div>

                      <label>
                        LinkedIn
                      </label>

                      <strong>
                        {personal.linkedin ||
                          "Not added"}
                      </strong>

                    </div>


                    <div>

                      <label>
                        GitHub
                      </label>

                      <strong>
                        {personal.github ||
                          "Not added"}
                      </strong>

                    </div>

                  </div>


                  {profileMessage && (

                    <div className="cv-profile-success">

                      {profileMessage}

                    </div>

                  )}

                </>

              ) : (

                /* ==================================
                   EDIT MODE
                   ================================== */

                <div className="cv-profile-edit-form">


                  <div className="cv-form-field">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={
                        personal.username
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          username:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="cv-form-field">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={
                        personal.email
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          email:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="cv-form-field">

                    <label>
                      Phone Number
                    </label>

                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={
                        personal.phone
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          phone:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="cv-form-field">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      placeholder="Example: Pune, Maharashtra"
                      value={
                        personal.location
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          location:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="cv-form-field">

                    <label>
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      value={
                        personal.dateOfBirth
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          dateOfBirth:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="cv-form-field">

                    <label>
                      LinkedIn Profile
                    </label>

                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/yourname"
                      value={
                        personal.linkedin
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          linkedin:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  <div className="cv-form-field">

                    <label>
                      GitHub Profile
                    </label>

                    <input
                      type="text"
                      placeholder="https://github.com/yourname"
                      value={
                        personal.github
                      }
                      onChange={(e) =>
                        setPersonal({
                          ...personal,
                          github:
                            e.target.value
                        })
                      }
                    />

                  </div>


                  {/* BUTTONS */}

                  <div className="cv-form-buttons">

                    <button
                      type="button"
                      className="cv-cancel-button"
                      onClick={() => {

                        setPersonal({

                          username:
                            user?.username || "",

                          email:
                            user?.email || "",

                          phone:
                            user?.phone || "",

                          location:
                            user?.location || "",

                          dateOfBirth:
                            user?.dateOfBirth || "",

                          linkedin:
                            user?.linkedin || "",

                          github:
                            user?.github || ""

                        });

                        setEditingPersonal(
                          false
                        );

                        setProfileMessage("");

                      }}
                    >
                      Cancel
                    </button>


                    <button
                      type="button"
                      className="cv-save-button"
                      onClick={
                        handlePersonalSave
                      }
                      disabled={saving}
                    >

                      {saving
                        ? "Saving..."
                        : "Save Changes"}

                    </button>

                  </div>


                  {profileMessage && (

                    <div className="cv-profile-error">

                      {profileMessage}

                    </div>

                  )}

                </div>

              )}

            </div>


          </div>

        </div>

      </div>

    </div>

  );
}

export default Profile;