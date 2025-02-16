import React from "react"
import Navbar from "../components/Navbar"
import { useUser } from "../contexts/UserContext"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"


const Profile = () => {
  const { user: auth0User } = useAuth0()
  const { user, error, loading } = useUser()

  return (
    <>
      <Navbar />
      <div className="Profile">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ←
        </button>
        <div className="Block">
          <div className="Block-header">Your Profile</div>
          {/* Display Auth0 or Backend loading/errors */}
          {loading ? (
            <p>Loading user info...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : auth0User && user ? (
            <div>
              <p>Username: {user.username}</p>
              <p>Role: {user.role}</p>
              <p>Email: {auth0User.email}</p>
            </div>
          ) : (
            <p>No user info available</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
