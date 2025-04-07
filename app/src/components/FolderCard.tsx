import React from "react"

interface WorkshopCardProps {
  name: string
  description: string
  imageUrl?: string | null
  onClick?: () => void
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  name,
  description,
  imageUrl,
  onClick,
}) => {
  return (
    <div className="FolderCard" onClick={onClick}>
      {imageUrl ? (
        <div
          className="FolderCard-image"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "120px",
          }}
        />
      ) : (
        <div className="FolderCard-color Background-color--teal-1000" />
      )}
      <div className="Padding--10">
        <div className="FolderCard-name">{name}</div>
        <div className="FolderCard-description">{description}</div>
      </div>
    </div>
  )
}

export default WorkshopCard
