import React, { useState } from "react";
import "./Loginbox.css";
import { useNavigate } from "react-router";
import userAPI from "../services/UserService";

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

    userAPI.SignIn(formData);

    setForm({ password: "" });
    navigate("/");
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
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <input type="submit" className="btn-submit"></input>
      </form>
    </div>
  );
};

export default Loginbox;
