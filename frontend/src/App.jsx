import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
  setUser(data.user);
      } else {
        setMessage("Signup failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to backend");
    }
  };

  if (user) {
  return (
    <Dashboard
      user={user}
      onLogout={() => setUser(null)}
    />
  );
}

  return (
    <div className="signup-page">

      {/* LEFT BLUE SECTION */}
      <section className="left-section">

        <div className="logo">
          <div className="logo-box">💼</div>
          <div>
            <h2>CareerVault</h2>
            <p>Your Career. Your Priority.</p>
          </div>
        </div>

        <div className="illustration">

          <div className="job-card left-card">
            <strong>JOBS</strong>
            <div className="mini-icon">💼</div>
            <div className="line long"></div>
            <div className="line"></div>
            <div className="small-button"></div>
          </div>

          <div className="person">
            👩🏻‍💻
          </div>

          <div className="profile-card">
            <div className="avatar">👤</div>
            <div className="line long"></div>
            <div className="line"></div>
            <div className="stars">★★★★☆</div>
          </div>

          <div className="search-icon">
            🔍
          </div>

          <div className="check-card">
            ✓
            <div className="line"></div>
            ✓
            <div className="line"></div>
            ✓
          </div>

          <div className="plant">
            🪴
          </div>

        </div>

        <div className="welcome-text">
          <h1>Build Your Career Journey</h1>

          <p>
            Track your job applications, manage interviews
            and achieve your career goals.
          </p>
        </div>

        <div className="features">

          <div className="feature">
            <div className="feature-icon">📄</div>
            <h3>Track Jobs</h3>
            <p>Keep track of all your job applications.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">👤</div>
            <h3>Manage Applications</h3>
            <p>Organize and manage your applications.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>Track Status</h3>
            <p>Monitor the status of your applications.</p>
          </div>

        </div>

      </section>

      {/* RIGHT WHITE SECTION */}
      <section className="right-section">

        <div className="form-container">

          <h1>Sign Up</h1>

          <p className="form-subtitle">
            Create your account to get started
          </p>

          <form onSubmit={handleSignup}>

            <div className="input-group">
              <label>Username</label>

              <div className="input-wrapper">
                <span>👤</span>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <span>✉</span>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <span>👁</span>
              </div>
            </div>

            <button type="submit">
              SIGN UP
            </button>

          </form>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <p className="signin">
            Already have an account?
            <span> Sign In</span>
          </p>

        </div>

      </section>

    </div>
  );
}


export default App;