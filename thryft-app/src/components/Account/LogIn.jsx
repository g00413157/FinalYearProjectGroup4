import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Form } from "react-bootstrap";

import "../../styles/Account.css";

export default function LogIn() {
  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect away from login if already logged in
  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser, navigate]);

  // ===============================
  // 🌟 GOOGLE LOGIN HANDLER
  // ===============================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const cred = GoogleAuthProvider.credential(
        credentialResponse.credential
      );

      const result = await signInWithCredential(auth, cred);
      console.log("Google Auth User:", result.user);

      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  // ===============================
  // 🌟 HANDLE FORM INPUT
  // ===============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===============================
  // 🌟 SUBMIT HANDLER
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        // SIGN UP with NAME
        await register(formData.email, formData.password, formData.name);
        console.log("Signed up:", formData.email);
      } else {
        // LOG IN
        await login(formData.email, formData.password);
        console.log("Logged in:", formData.email);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
  
      <div className="account-box text-center">
        <h2>{isSignUp ? "Create an Account" : "Sign in to Thryft"}</h2>
  
        <form onSubmit={handleSubmit} className="w-100 mx-auto" style={{ maxWidth: "320px" }}>
  
          {isSignUp && (
            <Form.Group className="mb-3 text-start">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}
  
          <div className="form-group mb-3 text-start">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group mb-3 text-start">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
  
          {isSignUp && (
            <div className="form-group mb-3 text-start">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
  
          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
  
        <div className="divider my-4">or</div>
  
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
  
        <p className="mt-4">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(false)}>
                Log In
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button className="btn btn-link p-0" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
  
}
