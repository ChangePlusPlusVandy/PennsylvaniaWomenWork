import React from "react";
import Navbar from "../components/Navbar";
import pdf from "../assets/pdf.jpg";
import docx from "../assets/docx.png";
import video from "../assets/video.png";
import Icon from "../components/Icon";
import { useNavigate, useLocation } from "react-router-dom";

// 🔹 Define Fake Data
const fakeFiles = [
  {
    id: 1,
    name: "Resume_Prep.pdf",
    type: "pdf",
    icon: pdf,
  },
  {
    id: 2,
    name: "Workshop_Intro.mp4",
    type: "video",
    icon: video,
  },
  {
    id: 3,
    name: "Cover_Letter.docx",
    type: "docx",
    icon: docx,
  },
];

const WorkshopInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workshopId = location.state?.workshopId;

  return (
    <>
      <Navbar />
      <div className="WorkshopInfo">
        <div className="Block">
          <div onClick={() => navigate("/home")} className=" Margin-bottom--10">
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>
          <div className="Block-header Flex-row">
            Workshop Information
            <div className="Button Button-color--blue-1000 Margin-left--auto">
              Add New Files
            </div>
          </div>
          <div className="Block-subtitle">Add New Files</div>

          <div className="row gx-3 gy-3">
            {fakeFiles.map((file) => (
              <div key={file.id} className="col-lg-2">
                <div className="Card">
                  {" "}
                  {/* Ensure Card is inside col-lg-2 */}
                  <div className="WorkshopInfo-image">
                    <img src={file.icon} alt={file.type} />
                  </div>
                  <div className="WorkshopInfo-title">{file.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkshopInformation;
