import React from "react"
import { useProfileImage } from "../utils/custom-hooks"

interface ParticipantCardProps {
  firstName: string
  lastName: string
  email: string
  profilePictureId?: string
  onClick?: () => void
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  firstName,
  lastName,
  email,
  profilePictureId,
  onClick,
}) => {
  const profileImage = useProfileImage(profilePictureId)

  const initials =
    (firstName?.charAt(0)?.toUpperCase() || "") +
    (lastName?.charAt(0)?.toUpperCase() || "")

  return (
    <div className="ParticipantCard" onClick={onClick}>
      <div className="ParticipantCard-avatarWrapper">
        {profileImage ? (
          <img
            src={profileImage}
            alt={`${firstName} ${lastName}`}
            className="ParticipantCard-avatar"
          />
        ) : (
          <div className="ParticipantCard-avatarPlaceholder">{initials}</div>
        )}
      </div>
      <div className="ParticipantCard-details">
        <div className="ParticipantCard-name">
          <strong>
            {firstName} {lastName}
          </strong>
        </div>
        <div className="ParticipantCard-email">{email}</div>
      </div>
    </div>
  )
}

export default ParticipantCard
