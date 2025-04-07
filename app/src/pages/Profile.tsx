import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";

const Profile = () => {
  const { user: auth0User, logout } = useAuth0();
  const { user, error, loading } = useUser();
  const [mentorInfo, setMentorInfo] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchMentorInfo = async () => {
      if (user && user.role === "mentee") {
        try {
          const res = await api.get(
            `/api/mentor/mentor-for-mentee/${user._id}`,
          );
          setMentorInfo(res.data);
        } catch (err) {
          console.error("Error fetching mentor info", err);
        }
      }
    };

    fetchMentorInfo();
  }, [user]);

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
              {user.role === "mentee" && mentorInfo && (
                <div className="Profile-mentor-section">
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginTop: "1.5rem",
                      marginBottom: "0.5rem",
                      color: "#333",
                    }}
                  >
                    Mentor Info:
                  </div>
                  <div className="Profile-field">
                    <div className="Profile-field-label">Name:</div>
                    <div>
                      {mentorInfo.first_name} {mentorInfo.last_name}
                    </div>
                  </div>
                  <div className="Profile-field">
                    <div className="Profile-field-label">Email:</div>
                    <div>{mentorInfo.email}</div>
                  </div>
                </div>
              )}
              <div
                className="Button Button-color--blue-1000 Margin-top--20"
                onClick={() => {
                  const returnTo = window.location.origin + "/logout";
                  logout({ logoutParams: { returnTo } });
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
