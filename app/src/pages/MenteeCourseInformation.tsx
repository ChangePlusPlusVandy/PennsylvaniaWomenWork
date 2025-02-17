import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import pdf from "../assets/pdf.jpg";
import docx from "../assets/docx.png";
import video from "../assets/video.png";

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

const MenteeCourseInformation = () => {
  return (
    <>
      <Navbar />
      <div className="WorkshopInfo">
        <div className="Block">
          <div className="Block-header">Resume workshop</div>
          <div className="Block-subtitle">
            This course will help you create a professional resume that will
            stand out to employers.
          </div>
          <div className="Block-body">
            <div className="row">
              {fakeFiles.map((file) => (
                <div key={file.id} className="col-lg-2">
                  <div className="Card-workshop">
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
      </div>
    </>
  );
};

export default MenteeCourseInformation;
