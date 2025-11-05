import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [message, setMessage] = useState("");
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    async function signupRequest() {
        try {
            const response = await fetch(`${store.API_BASE_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    email,
                    password,
                    phone_number: phoneNumber,
                    date_of_birth: dateOfBirth,
                }),
            });

            const body = await response.json();

            if (response.ok) {
                setMessage("Signup successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(body.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setMessage("An error occurred. Please try again later.");
        }
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center vh-100"
            style={{
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                color: "#333",
            }}
        >
            <div
                className="card shadow-lg p-4"
                style={{
                    maxWidth: "500px",
                    width: "100%",
                    borderRadius: "15px",
                    backgroundColor: "white",
                }}
            >
                <h2 className="text-center mb-4" style={{ color: "#4f46e5" }}>
                    Create Your Account
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        signupRequest();
                    }}
                >
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder=""
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2 mt-2"
                        style={{
                            backgroundColor: "#4f46e5",
                            borderColor: "#4f46e5",
                            borderRadius: "8px",
                            fontWeight: "600",
                        }}
                    >
                        Sign Up
                    </button>
                </form>

                {message && (
                    <div
                        className="alert mt-3 text-center"
                        style={{
                            backgroundColor: "#f1f5f9",
                            color: "#333",
                            borderRadius: "8px",
                        }}
                    >
                        {message}
                    </div>
                )}

                <div className="text-center mt-3">
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ color: "#4f46e5", fontWeight: "600" }}>
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};
