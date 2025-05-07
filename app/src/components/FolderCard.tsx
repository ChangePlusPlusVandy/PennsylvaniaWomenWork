import React from "react";

interface FolderCardProps {
  name: string;
  description: string;
  imageUrl?: string | null;
  onClick?: () => void;
  tags?: string[];
}

const FolderCard: React.FC<FolderCardProps> = ({
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
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {tags.length > 0 && (
            <div className="FolderCard-tags">
              {tags.map((tag) => (
                <span key={tag} className="FolderCard-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="FolderCard-color">
          {tags.length > 0 && (
            <div className="FolderCard-tags FolderCard-tags--static">
              {tags.map((tag, index) => (
                <span key={index} className="FolderCard-tag">
                  {tag}
                </span>
              ))}
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

export default FolderCard;
