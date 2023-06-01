import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SignUp } from "../services/UserService";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    setValidPwd(result);
  }, [pwd]);

  useEffect(() => {
    console.log(pwd);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v2 = PWD_REGEX.test(pwd);
    if (!v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      await SignUp({ setErrMsg }, user, pwd, firstName, lastName);
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status === 409) {
        setErrMsg("Email already in use");
      } else {
        setErrMsg("Registration failed");
        console.log(err);
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Account successfully created!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="login-form">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="register-box">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                ref={userRef}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="register-box">
              <label htmlFor="firstName">First Name:</label>
              <input
                id="firstName"
                type="text"
                required
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="off"
              ></input>
            </div>

            <div className="register-box">
              <label htmlFor="lastName">Last Name:</label>
              <input
                id="lastName"
                type="text"
                required
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="off"
              ></input>
            </div>

            <div className="register-box">
              <label htmlFor="pwd">Password:</label>
              <input
                type="password"
                id="pwd"
                onChange={(e) => setPwd(e.target.value)}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
            </div>

            <div className="register-box">
              <label htmlFor="confirm_pwd">Confirm Password:</label>
              <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
            </div>

            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              8 to 24 characters.
              <br />
              Must include an Uppercase letter, a number.
            </p>
            <p
              id="pwdnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              Passwords much match.
            </p>
            <div>
              <button
                className="btn-submit"
                disabled={!validPwd || !validMatch ? true : false}
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="register-link">
            Already registered? Please
            <Link to="/login" className="custom-link">
              &nbsp;Sign in
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
