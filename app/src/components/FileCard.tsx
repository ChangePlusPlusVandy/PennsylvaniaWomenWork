import React from "react";
import Icon from "../components/Icon"; // adjust path if needed
import pdf from "../assets/pdf.png";
import docx from "../assets/docx.png";
import video from "../assets/video.png";
import { useUser } from "../contexts/UserContext";

const getIconForFile = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return pdf;
    case "doc":
    case "docx":
      return docx;
    case "mp4":
    case "mov":
    case "avi":
      return video;
    default:
      return docx;
  }
};

export interface Resource {
  _id: string;
  name: string;
  s3id: string;
  type: string;
  description?: string;
  url: string;
}

interface FileCardProps {
  file: Resource;
  onDelete: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const { user } = useUser(); // ✅ valid here
  return (
    <div className="FileCard" onClick={() => window.open(file.url, "_blank")}>
      <div className="FileCard-icon">
        <img src={getIconForFile(file.s3id)} alt={file.type} />
      </div>

      <div className="FileCard-text">
        <div className="FileCard-title" title={file.name}>
          <div className="FileCard-titleText">{file.name}</div>
          {user?.role === "staff" && (
            <div
              className="FileCard-deleteIcon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Icon glyph="trash" />
            </div>
          )}
        </div>
        <div className="FileCard-description">
          {file.description || "No description"}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
