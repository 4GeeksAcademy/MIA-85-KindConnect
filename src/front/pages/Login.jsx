import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    async function loginRequest() {
        try {
            const response = await fetch(`${store.API_BASE_URL}/api/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const body = await response.json();

            if (response.ok) {
                const token = body.token;
                dispatch({ type: "authenticate", payload: token });
                setMessage("Login successful! Redirecting...");
                setTimeout(() => navigate("/demo"), 1500);
            } else {
                setMessage(body.message || "Invalid email or password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100 bg-light"
            style={{
                background: "linear-gradient(135deg, #007bff 0%, #6f42c1 100%)",
            }}
        >
            <div
                className="card shadow p-4"
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                }}
            >
                <h2 className="mb-4 text-center text-primary fw-bold">Login</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loginRequest();
                    }}
                >

                    <div className="mb-3">
                        <label htmlFor="loginEmail" className="form-label fw-semibold">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="loginEmail"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div id="emailHelp" className="form-text text-muted">
                            We'll never share your email with anyone else.
                        </div>
                    </div>

  
                    <div className="mb-3">
                        <label htmlFor="loginPassword" className="form-label fw-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="loginPassword"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

   
                    <div className="d-grid gap-2 mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{
                                backgroundColor: "#007bff",
                                border: "none",
                                transition: "0.3s",
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                        >
                            Login
                        </button>
                    </div>
                </form>

                {message && (
                    <div className="alert alert-info mt-3 text-center" role="alert">
                        {message}
                    </div>
                )}

                <div className="text-center mt-3">
                    <span>Don’t have an account? </span>
                    <Link to="/signup" className="fw-semibold text-decoration-none">
                        Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
};
