import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //Fetch profile details on load if not in store
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${store.API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${store.token}` },
        });

        if (!response.ok) throw new Error("Failed to load profile");

        const data = await response.json();
        dispatch({ type: "update_user", payload: data });
        setFormData(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setMessage("Unable to load profile data.");
      }
    };

    if (store.token && !store.user) 
        fetchProfile();
    else if (store.user) 
        setFormData(store.user);
  }, [store.token, store.user, store.API_BASE_URL, dispatch]);

  if (!store.token) {
    return (
      <div className="container mt-5">
        <h4>You must be logged in to view this page.</h4>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${store.API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "update_user", payload: data });
        setMessage("Profile updated successfully!");
        setEditing(false);
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Profile</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <div className="card mt-2 shadow-sm">
        <div className="card-body">
          {!editing ? (
            <>
              <p><strong>First Name:</strong> {formData.first_name || "N/A"}</p>
              <p><strong>Last Name:</strong> {formData.last_name || "N/A"}</p>
              <p><strong>Username:</strong> {formData.username || "N/A"}</p>
              <p><strong>Email:</strong> {formData.email || "N/A"}</p>
              <p><strong>Phone:</strong> {formData.phone_number || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {formData.date_of_birth || "N/A"}</p>

              <button
                className="btn btn-outline-primary me-2"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    value={formData.first_name || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    value={formData.last_name || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  className="form-control"
                  value={formData.phone_number || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  className="form-control"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                />
              </div>

              <button className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          )}

          {message && (
            <div className="alert alert-info mt-3 text-center">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};
