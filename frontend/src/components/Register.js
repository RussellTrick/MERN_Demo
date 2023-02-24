import React, { useEffect, useRef, useState } from "react";
import { SignUp } from "../services/UserService";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=[0-9]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");

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
    console.log(pwd);
    setValidPwd(result);
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
    // TODO: SignUp API
    try {
      const response = await SignUp(user, pwd);
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //TODO: clear input fields
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
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Email:</label>
            <input
              type="email"
              id="username"
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="off"
              required
            />

            <label
              htmlFor="
        pwd"
            >
              Password:
            </label>
            <input
              type="password"
              id="pwd"
              ref={userRef}
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscren"}
            >
              8 to 24 characters.
              <br />
              Must include an Uppercase letter, a number.
            </p>

            <label
              htmlFor="
        confirm_pwd"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm_pwd"
              ref={userRef}
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscren"
              }
            >
              Passwords much match.
            </p>

            <button disabled={!validPwd || !validMatch ? true : false}>
              Sign up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span>
              <a href="/login">Sign in</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
