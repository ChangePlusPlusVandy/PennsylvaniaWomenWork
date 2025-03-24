import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import pdf from "../assets/pdf.jpg";
import docx from "../assets/docx.png";
import video from "../assets/video.png";
import Icon from "../components/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";


const getIconForFile = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "pdf":
      return pdf
    case "doc":
    case "docx":
      return docx
    case "mp4":
    case "mov":
    case "avi":
      return video
    default:
      return docx
  }
}

interface Workshop {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  createdAt: string;
  mentor: string;
  mentee: string;
}

const WorkshopInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workshopId = location.state?.workshopId;
  const [resources, setResources] = useState<any[]>([]);
  const [workshop, setWorkshop] = React.useState<Workshop | null>(null);

  // get workshop information by id
  const getWorkshop = async () => {
    try {
      const response = await api.get(`/api/workshop/${workshopId}`);
      //console.log("Workshop:", response.data);
      setWorkshop(response.data);
    } catch (error) {
      console.error("Error getting workshop:", error);
    }
  };

  useEffect(() => {
    getWorkshop();
  }, []);

  useEffect(() => {
    // call endpoint to get all resources for a workshop
    const fetchResources = async () => {
      try {
        const {data: resourceList} = await api.get(`/api/resource/get-resource-by-workshop/${workshopId}`);
        const resourcesWithURL = await Promise.all(
          resourceList.map(async (res: any) => {
            const {data} = await api.get(`/api/resource/getURL/${res.s3id}`);
            return {...res, url: data.signedUrl};
          })
        )
        setResources(resourcesWithURL);
      } catch (error) {
        console.error("Error getting resources:", error);
      }
    };
  
    fetchResources();
  }, []);

  return (
    <>
      <Navbar />
      <div className="WorkshopInfo">
        <div className="Block">
          <div onClick={() => navigate("/home")} className=" Margin-bottom--10">
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>
          <div className="Block-header Flex-row">
            {workshop?.name}
            <div className="Button Button-color--blue-1000 Margin-left--auto">
              Add New Files
            </div>
          </div>
          <div className="Block-subtitle">{workshop?.description}</div>

          <div className="row gx-3 gy-3">
            {resources.map((file) => (
              <div key={file._id} className="col-lg-2">
                <div className="Card" onClick={() => window.open(file.url, "_blank")}>
                  {" "}
                  {/* Ensure Card is inside col-lg-2 */}
                  <div className="WorkshopInfo-image">
                    <img src={getIconForFile(file.s3id)} alt={file.type} />
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
