import React, { useRef, useEffect, useState } from "react";
import "./Loginbox.css";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../services/UserService";
import useAuth from "../hooks/useAuth";

const Loginbox = () => {
  const { checkAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const authenticated = checkAuth();

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard");
    }
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  function onSubmit(e) {
    e.preventDefault();
    SignIn({ setErrMsg }, user, pwd, () => {
      setPwd("");
      navigate("/dashboard");
    });
  }

  return (
    <section className="login-form">
      <h2>Login</h2>

      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <form onSubmit={onSubmit}>
        <div className="user-box">
          <input
            type="text"
            name="email"
            id="email"
            ref={userRef}
            required
            onChange={(e) => setUser(e.target.value)}
            value={user}
          />
          <label htmlFor="email">Email</label>
        </div>

        <div className="user-box">
          <input
            type="password"
            name="password"
            id="password"
            required
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
          />
          <label htmlFor="password">Password</label>
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
          &nbsp;Signup now
        </a>
      </div>
    </section>
  );
};

export default Loginbox;
