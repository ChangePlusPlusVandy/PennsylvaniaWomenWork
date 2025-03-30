import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user: auth0User, logout } = useAuth0();
  const { user, error, loading } = useUser();

  // Function to compute initials from first and last name
  const getInitials = () => {
    if (!user) return "";
    const firstInitial = user.first_name
      ? user.first_name.charAt(0).toUpperCase()
      : "";
    const lastInitial = user.last_name
      ? user.last_name.charAt(0).toUpperCase()
      : "";
    return firstInitial + lastInitial;
  };

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
                {/* Display user's initials instead of an image */}
                <div className="Profile-initials">{getInitials()}</div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Name:</div>
                <div>
                  {user.first_name} {user.last_name}
                </div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Role:</div>
                <div>{user.role}</div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Email:</div>
                <div>{user.email}</div>
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
