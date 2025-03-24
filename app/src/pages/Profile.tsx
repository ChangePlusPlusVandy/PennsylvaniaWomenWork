import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const Profile = () => {
  const { user: auth0User, logout } = useAuth0();
  const { user, error, loading } = useUser();

  // use effect dump user data to console
  useEffect(() => {
    console.log("auth0User", auth0User?.sub);
    console.log("user", user);
  });

  return (
    <>
      <Navbar />

      <div className="Profile">
        {loading ? (
          <p>Loading user info...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : auth0User && user ? (
          <div className="Block Profile-Block">
            <div className="Block-header">Profile Information</div>
            <div className="Block-subtitle">User Details and Settings</div>
            <div className="Block-content">
              <div className="Profile-avatar">
                <img
                  src={auth0User.picture}
                  alt={`${auth0User.name}'s profile`}
                  className="Profile-avatar-image"
                />
              </div>
              {/* <div className="Profile-field">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Username:</strong>
                  <span>{user.username}</span>
                </div>
              </div> */}
              <div className="Profile-field">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Name:</strong>
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              </div>
              <div className="Profile-field">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Role:</strong>
                  <span>{user.role}</span>
                </div>
              </div>
              <div className="Profile-field">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>Email:</strong>
                  <span>{auth0User.email}</span>
                </div>
              </div>
              <div
                className="Button Button-color--blue-1000 Margin-top--20"
                onClick={() => {
                  logout();
                }}
              >
                Log Out
              </div>
            </div>
          </div>
        ) : (
          <p>No user info available</p>
        )}
      </div>
    </>
  );
};

export default Profile;
