import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  async function fetchQuestion() {
    setMessage("");
    setSecurityQuestion("");
    try {
      const response = await fetch(`${store.API_BASE_URL}/api/resetPassword/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSecurityQuestion(data.security_question);
        setStep(2);
      } else {
        setMessage(data.message || "Error fetching question");
      }
    } catch (err) {
      setMessage("Network error, please try again.");
    }
  }

  async function resetPassword() {
    setMessage("");
    try {
      const response = await fetch(`${store.API_BASE_URL}/api/resetPassword/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          security_answer: securityAnswer,
          new_password: newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setStep(3);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Error resetting password");
      }
    } catch (err) {
      setMessage("Network error, please try again.");
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Reset Password</h3>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-primary w-100 mb-2" onClick={fetchQuestion}>
              Get Security Question
            </button>

            <button
              className="btn btn-secondary w-100"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p><strong>Question:</strong> {securityQuestion}</p>
            <input
              type="text"
              placeholder="Your answer"
              className="form-control mb-3"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              className="form-control mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn btn-success w-100 mb-2" onClick={resetPassword}>
              Reset Password
            </button>
            <button
              className="btn btn-secondary w-100"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </>
        )}

        {message && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
