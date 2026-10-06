import { useEffect, useState } from "react";
import "./Dashboard.css";
import Profile from "./Profile";

function Dashboard({ user, onLogout }) {

  const [jobs, setJobs] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showAddJob, setShowAddJob] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("Applied");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");

  // =========================
  // LOAD JOBS
  // =========================

  const loadJobs = () => {

    fetch(`http://localhost:8080/jobs/user/${user.id}`)
      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        return response.json();

      })
      .then((data) => {

        setJobs(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });
  };

  useEffect(() => {
    loadJobs();
  }, [user.id]);


  // =========================
  // STATISTICS
  // =========================

  const applied = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewing = jobs.filter(
    (job) => job.status === "Interviewing"
  ).length;

  const offers = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;


  // =========================
  // ADD JOB
  // =========================

  const handleAddJob = async (e) => {

    e.preventDefault();

    const newJob = {
      companyName,
      jobTitle,
      status,
      dateApplied,
      notes,
      userId: user.id
    };

    try {

      const response = await fetch(
        "http://localhost:8080/jobs/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(newJob)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add job");
      }

      // Clear form

      setCompanyName("");
      setJobTitle("");
      setStatus("Applied");
      setDateApplied("");
      setNotes("");

      // Close form

      setShowAddJob(false);

      // Reload jobs

      loadJobs();

    } catch (error) {

      console.error(error);

      alert("Could not add job");

    }
  };

  if (showProfile) {
    return (
      <Profile
        user={user}
        onBack={() => setShowProfile(false)}
      />
    );
  }


  return (

    <div className="dashboard">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="dashboard-logo">

          <div className="dashboard-logo-icon">
            💼
          </div>

          <div>

            <h2>
              CareerVault
            </h2>

            <p>
              Your Career. Your Priority.
            </p>

          </div>

        </div>


        <nav className="sidebar-nav">

          <div className="nav-item active">
            <span>🏠</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>💼</span>
            My Jobs
          </div>

          <div className="nav-item">
            <span>📊</span>
            Analytics
          </div>

          <div className="nav-item">
            <span>📅</span>
            Interviews
          </div>

          <div className="nav-item">
            <span>⚙️</span>
            Settings
          </div>

        </nav>


        <button
          className="logout-button"
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="small-heading">
              YOUR CAREER DASHBOARD
            </p>

            <h1>
              Welcome, {user.username}! 👋
            </h1>

            <p className="welcome-description">
              Your next opportunity could be closer than you think.
              Keep moving forward.
            </p>

          </div>


          <div className="user-profile">

            <div
  className="user-avatar"
  onClick={() => setShowProfile(true)}
  style={{ cursor: "pointer" }}
>
  {user.username?.charAt(0).toUpperCase()}
</div>

            <div>

              <strong>
                {user.username}
              </strong>

              <p>
                {user.email}
              </p>

            </div>

          </div>

        </header>


        {/* =========================
            JOURNEY CARD
        ========================= */}

        <section className="journey-card">

          <div className="journey-content">

            <div className="rocket">
              🚀
            </div>

            <div>

              <h2>
                Keep Moving Forward
              </h2>

              <p>
                Every application is one step closer
                to the right opportunity.
              </p>

            </div>

          </div>


          <div className="journey-flow">

            <div className="journey-step">

              <div className="journey-number">
                {jobs.length}
              </div>

              <span>
                Applications
              </span>

            </div>


            <div className="journey-line"></div>


            <div className="journey-step">

              <div className="journey-number">
                {interviewing}
              </div>

              <span>
                Interviews
              </span>

            </div>


            <div className="journey-line"></div>


            <div className="journey-step">

              <div className="journey-number">
                {offers}
              </div>

              <span>
                Offers
              </span>

            </div>

          </div>

        </section>


        {/* =========================
            STATISTICS
        ========================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              📄
            </div>

            <div>

              <p>
                Applied
              </p>

              <h2>
                {applied}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              💬
            </div>

            <div>

              <p>
                Interviewing
              </p>

              <h2>
                {interviewing}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              🎉
            </div>

            <div>

              <p>
                Offers
              </p>

              <h2>
                {offers}
              </h2>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon red">
              📌
            </div>

            <div>

              <p>
                Rejected
              </p>

              <h2>
                {rejected}
              </h2>

            </div>

          </div>

        </section>


        {/* =========================
            APPLICATIONS
        ========================= */}

        <section className="applications-section">


          <div className="section-header">

            <div>

              <h2>
                Recent Applications
              </h2>

              <p>
                Keep track of your latest opportunities.
              </p>

            </div>


            <button
              className="add-job-button"
              onClick={() => setShowAddJob(true)}
            >
              + Add Job
            </button>

          </div>


          {/* =========================
              ADD JOB FORM
          ========================= */}

          {showAddJob && (

            <div className="add-job-form">

              <div className="add-job-form-header">

                <div>

                  <h2>
                    Add Job Application
                  </h2>

                  <p>
                    Add a new opportunity to your career journey.
                  </p>

                </div>

                <button
                  className="close-form"
                  onClick={() => setShowAddJob(false)}
                >
                  ✕
                </button>

              </div>


              <form onSubmit={handleAddJob}>

                <div className="form-row">

                  <div className="dashboard-input">

                    <label>
                      Company Name
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. TCS"
                      value={companyName}
                      onChange={(e) =>
                        setCompanyName(e.target.value)
                      }
                      required
                    />

                  </div>


                  <div className="dashboard-input">

                    <label>
                      Job Title
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Java Developer"
                      value={jobTitle}
                      onChange={(e) =>
                        setJobTitle(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                <div className="form-row">

                  <div className="dashboard-input">

                    <label>
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                    >

                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Interviewing">
                        Interviewing
                      </option>

                      <option value="Offer">
                        Offer
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                    </select>

                  </div>


                  <div className="dashboard-input">

                    <label>
                      Date Applied
                    </label>

                    <input
                      type="date"
                      value={dateApplied}
                      onChange={(e) =>
                        setDateApplied(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                <div className="dashboard-input">

                  <label>
                    Notes
                  </label>

                  <textarea
                    placeholder="Add any notes about this application..."
                    value={notes}
                    onChange={(e) =>
                      setNotes(e.target.value)
                    }
                  ></textarea>

                </div>


                <div className="form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowAddJob(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-job-button"
                  >
                    Save Job
                  </button>

                </div>

              </form>

            </div>

          )}


          {/* =========================
              JOB LIST
          ========================= */}

          {loading ? (

            <div className="empty-message">
              Loading your applications...
            </div>

          ) : jobs.length === 0 ? (

            <div className="empty-message">

              <div className="empty-icon">
                💼
              </div>

              <h3>
                Your journey starts here
              </h3>

              <p>
                Add your first job application and start
                tracking your career journey.
              </p>

            </div>

          ) : (

            <div className="job-list">

              {jobs.map((job) => (

                <div
                  className="application-card"
                  key={job.id}
                >

                  <div className="company-icon">
                    {job.companyName?.charAt(0).toUpperCase()}
                  </div>


                  <div className="job-information">

                    <h3>
                      {job.jobTitle}
                    </h3>

                    <p>
                      {job.companyName}
                    </p>

                  </div>


                  <div className="job-date">
                    {job.dateApplied}
                  </div>


                  <div
                    className={`status status-${job.status?.toLowerCase()}`}
                  >
                    {job.status}
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;