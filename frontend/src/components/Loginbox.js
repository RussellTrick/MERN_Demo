import React, { useEffect } from "react";
import "./Loginbox.css";
import axios from "axios";

const urlStart = "http://localhost:3001";

const Loginbox = () => {
  const tryLogin = async () => {
    const data = await axios.get(urlStart + "/api/v1/users/getusers");
    console.log(data);
  };

  useEffect(() => {
    tryLogin();
  }, []);

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form>
        <div className="user-box">
          <input type="text" name="" required=" "></input>
          <label>Email</label>
        </div>

        <div className="user-box">
          <input type="password" name="" required=" "></input>
          <label>Password</label>
        </div>

        <div>
          <a href="#" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <a href="#" className="btn-submit">
          Submit
        </a>
      </form>
    </div>
  );
};

export default Loginbox;
