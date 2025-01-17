import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

interface MenteeInformationElements {
  id: number;
  menteeName: string;
}

interface CourseInformationElements {
  id: number;
  courseName: string;
}

const handleClick = (item: MenteeInformationElements) => {
  console.log("Clicked:", item);
};

const MentorDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("My Mentees");

  const menteeGridData: MenteeInformationElements[] = [
    {
      id: 1,
      menteeName: "Jane Doe",
    },
  ];

  const courseGridData: CourseInformationElements[] = [
    {
      id: 1,
      courseName: "Resume",
    },
  ];

  const handleClick = (id: number) => {
    navigate(`/mentor/mentee-information/`);
  };

  return (
    <>
      <Navbar />
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Block Width--60 Margin-right--40 Margin-left--40 Margin-top--40 Height--100vh">
          <div className="Flex-row Margin-bottom--30">
            {["My Mentees", "Courses"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  "Cursor--pointer Padding-bottom--8 Margin-right--32 Text-fontSize--20 " +
                  (activeTab === tab
                    ? "Border-bottom--blue Text-color--gray-1000"
                    : "Text-color--gray-600")
                }
                style={{
                  cursor: "pointer",
                  paddingBottom: "8px",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #0096C0"
                      : "2px solid transparent",
                  marginRight: "48px",
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {activeTab === "My Mentees" && (
            <div>
              <div className="Flex-grid Justify-content--spaceBetween Margin-bottom--40">
                {menteeGridData.map((item) => (
                  <div
                    className="Card Card--noPadding Card-hover Margin-right--10"
                    style={{ width: "215px" }}
                    onClick={() => handleClick(item.id)}
                  >
                    <div
                      className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center"
                      style={{ height: "96px" }}
                    />
                    <div className="Padding--10" style={{ height: "75px" }}>
                      <h3 className="Text-fontSize--20 Text-color--gray-600">
                        {item.menteeName}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Courses" && (
            <div className="Flex-grid Justify-content--spaceBetween Margin-bottom--40">
              {courseGridData.map((item) => (
                <div
                  className="Card Card--noPadding Card-hover Margin-right--10"
                  style={{ width: "215px" }}
                  onClick={() => handleClick(item.id)}
                >
                  <div
                    className="Background-color--teal-1000 Padding--20 Border-radius-topLeft--8 Border-radius-topRight--8 Align-items--center Justify-content--center"
                    style={{ height: "96px" }}
                  />
                  <div className="Padding--10" style={{ height: "75px" }}>
                    <h3 className="Text-fontSize--20 Text-color--gray-600">
                      {item.courseName}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {activeTab === "My Mentees" && (
          <div className="Block Width--40 Margin-right--40 Margin-top--40 Height--100vh">
            <div className="Block-header Text--center Text-color--gray-1000 Margin-bottom--20">
              Upcoming Events!
            </div>
          </div>
        )}

        {activeTab === "Courses" && (
          <div className="Block Width--40 Margin-right--40 Margin-top--40 Height--100vh">
            <div
              className="Block-header Text--center Text-color--gray-1000 Margin-bottom--20"
              style={{
                borderBottom: "2px solid rgba(84, 84, 84, 0.2)",
                paddingBottom: "10px"
              }}
            >
              Create A New Course
            </div>
            <div className = "Flex-row Justify-content--left">
              <div className = "Text-fontSize--15 Text-color--gray-800 Margin-bottom--16 Margin-left--20">
                Name: 
              </div>
            </div>
            <div className = "Flex-row Justify-content--left">
              <div className = "Text-fontSize--15 Text-color--gray-800 Margin-bottom--30 Margin-left--20">
                Description: 
              </div>
            </div>
            <div className = "Flex-row Justify-content--left">
              <div className = "Button--large Border-radius--4 Text-fontSize--16 Button-color--teal-1000 Margin-bottom--16 Margin-left--20 "
              onClick={() => {
                navigate("/create-workshop");
              }}>
                Add New Files 
              </div> 
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MentorDashboard;
