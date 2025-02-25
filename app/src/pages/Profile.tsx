import React from "react";
import Navbar from "../components/Navbar";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

const Profile = () => {
  const { user: auth0User } = useAuth0();
  const { user, error, loading } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="Profile">

        <div onClick={() => navigate("/home")} className=" Margin-bottom--10">
          <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
        </div>
        {loading ? (
          <p>Loading user info...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : auth0User && user ? (
          <div>
            <div className="Profile-username--text">
              {user.username} <span className="Profile-separator">|</span> <span className="Profile-role--text">{user.role}</span>
            </div>
            <div className="Profile-email--text">Email: <u>{auth0User.email}</u></div>
          </div>
        ) : (
          <p>No user info available</p>
        )}
      </div>
    </>
  );
};

export default Profile;
