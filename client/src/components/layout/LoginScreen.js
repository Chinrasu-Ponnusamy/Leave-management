import React, { useState } from "react";
import { MOCK_USERS } from "../../data/mockData";
import { Icon, Icons } from "../common/Icons";
import "./LoginScreen.css";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("employee@company.com");
  const [pass, setPass] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === pass
      );

      if (user) {
        onLogin(user);
      } else {
        setError("Invalid credentials");
        setLoading(false);
      }
    }, 600);
  };

  const quickLogin = (role) => {
    const u = MOCK_USERS.find((u) => u.role === role);
    setEmail(u.email);
    setPass(u.password);
  };

  return (
    <div className="login-container">
      {/* Background circles */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-circle"
          style={{
            width: 200 + i * 180,
            height: 200 + i * 180,
          }}
        />
      ))}

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="logo-box">
            <Icon d={Icons.calendar} size={28} color="#fff" />
          </div>

          <h1 className="title">LeavePortal</h1>
          <p className="subtitle">Employee Leave Management System</p>
        </div>

        {/* Quick login */}
        <div className="quick-login">
          {["employee", "manager", "admin"].map((r) => (
            <button
              key={r}
              className="quick-btn"
              onClick={() => quickLogin(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Email */}
        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Error */}
        {error && <p className="error-text">{error}</p>}

        {/* Button */}
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {/* Footer */}
        <p className="footer-text">
          Demo credentials: password123 for all accounts
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;