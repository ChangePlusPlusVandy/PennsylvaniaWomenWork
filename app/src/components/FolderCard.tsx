import React from "react";

interface WorkshopCardProps {
  name: string;
  description: string;
  imageUrl?: string | null;
  onClick?: () => void;
  tags?: string[];
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  name,
  description,
  imageUrl,
  onClick,
  tags = [],
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
        <div className="FolderCard-color Background-color--teal-1000">
          {tags.length > 0 && (
            <div className="File-tags-container">
              <div className="File-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="Tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="Padding--10">
        <div className="FolderCard-name">{name}</div>
        <div className="FolderCard-description">{description}</div>
      </div>
    </div>
  );
};

export default WorkshopCard;
