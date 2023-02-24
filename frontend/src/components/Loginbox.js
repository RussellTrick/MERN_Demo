import React, { useState } from "react";
import "./Loginbox.css";
import { useNavigate } from "react-router";
import { SignIn } from "../services/UserService";

const Loginbox = () => {
  const [formData, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function onSubmit(e) {
    e.preventDefault();

    SignIn(formData);

    setForm({ password: "" });
    navigate("/dashboard");
  }

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className="user-box">
          <input
            type="text"
            name="email"
            required=" "
            onChange={handleChange}
          ></input>
          <label>Email</label>
        </div>

        <div className="user-box">
          <input
            type="password"
            name="password"
            required=" "
            onChange={handleChange}
          ></input>
          <label>Password</label>
        </div>

        <div>
          <a href="#" className="forgot-password" style={{ color: "#4070F5" }}>
            Forgot password?
          </a>
        </div>

        <input type="submit" className="btn-submit"></input>
      </form>

      <div className="register-link">
        Don't have an account?
        <a href="/register" style={{ color: "#4070F5" }}>
          Signup now
        </a>
      </div>
    </div>
  );
};

export default Loginbox;
