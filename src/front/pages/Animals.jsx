import React, { useState } from "react";
import 'bootstrap';

function CreatePost() {
  const [zipcode, setZipcode] = useState("");
  const [activeTab, setActiveTab] = useState("Need");
  const [filter, setFilter] = useState("All");
  const [posts] = useState([]); 

  const handleZipChange = (e) => {
    setZipcode(e.target.value); 
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    alert(`Searching near ZIP code: ${zipcode}`);
  };

  const handleCreatePost = () => {
    alert("Open Create Post Form");
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="flex-grow-1 text-center">
          <form
            onSubmit={handleZipSubmit}
            className="d-inline-flex align-items-center justify-content-center"
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter ZIP code"
              style={{ width: "200px" }}
              value={zipcode}
              onChange={handleZipChange}
            />
            <button type="submit" className="btn btn-success">
              Add ZIP Code to narrow down search
            </button>
          </form>
        </div>
        <button className="btn btn-primary me-3" onClick={handleCreatePost}>
          + Create Post
        </button>
      </div>

      <div className="text-center mb-4">
        <div className="btn-group" role="group">
          <button
            className={`btn ${
              activeTab === "Need" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("Need")}
          >
            Need
          </button>
          <button
            className={`btn ${
              activeTab === "Donate" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("Donate")}
          >
            Donate
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div
            className="card p-3 shadow-sm"
            style={{ backgroundColor: "#d9fdd3" }}
          >
            <h5 className="card-title text-center mb-3">Filter</h5>
            <div className="d-grid gap-2">
              <button
                className="btn btn-light border"
                onClick={() => setFilter("Animals")}
              >
                Animals
              </button>
              <button
                className="btn btn-light border"
                onClick={() => setFilter("Honey Do's")}
              >
                Honey Do's
              </button>
              <button
                className="btn btn-light border"
                onClick={() => setFilter("Food")}
              >
                Food
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-9 text-center">
          {posts.length === 0 ? (
            <h4 className="text-muted mt-5">No posts yet</h4>
          ) : (
            posts.map((post) => <Post key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

function Post({ post }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{post.username}</h5>
        <p className="card-text">{post.text}</p>
      </div>
    </div>
  );
}


export default CreatePost;