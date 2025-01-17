import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Image from "../assets/image.jpg";

const MenteeInformation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Workshops");

  const menteeData = {
    name: "Chloe Kim",
    role: "Marketing",
    description:
      "Lorem ipsum dolor sit amet consectetur. In lectus et et pellentesque a mattis. Sapien morbi congue nulla diam sit non at. Arcu platea semper fermentum at fusce. Eu sem varius molestie elit venenatis. Nulla est sollicitudin.",
    workshops: ["Resume Prep", "Career Advancement", "Resume Workshop"],
  };

  return (
    <>
      <Navbar />
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Block Width--80 Margin-right--40 Margin-left--40 Margin-top--40 Height--100vh">
          <div className="Width--60">
            <div className="Flex-row Margin-bottom--40 Margin-left--60 Margin-right--100 Margin-top--30">
              <img
                src={Image}
                alt="Profile"
                className="Border--rounded"
                style={{ width: "120px", height: "120px" }}
              />
              <div>
                <div className="Text-fontSize--22 Text-color--gray-1000 Margin-left--16 Margin-bottom--6 Margin-top--40 Padding-left--70">
                  {menteeData.name}
                </div>
                <div className="Text-fontSize--15 Text-color--gray-600 Margin-left--16 Margin-top--7">
                  {menteeData.role}
                </div>
              </div>
            </div>

            <div className="Flex-row Margin-bottom--20 Margin-right--100 Margin-left--60">
              <div className="Text-fontSize--18 Text-color--gray-1000">
                Information
              </div>
            </div>
            <div className="Flex-row Margin-bottom--40 Margin-right--100 Margin-left--60">
              <div className="Text-color--gray-600 Text-fontSize--16">
                {menteeData.description}
              </div>
            </div>

            <div>
              <div>
                <div className="Flex-row Justify-content--spaceBetween Margin-bottom--24 Margin-left--60">
                  {["Workshops", "Meetings", "Schedule New"].map((tab) => (
                    <div
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={
                        "Cursor--pointer Padding-bottom--8 Margin-right--32 Text-fontSize--15 " +
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

                {activeTab === "Workshops" && (
                  <div>
                    <div
                      className="Text-fontSize--20 Text-color--teal-800 Margin-left--60 Margin-bottom--20"
                      style={{
                        borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
                        paddingBottom: "10px",
                      }}
                    >
                      Current Workshops
                    </div>
                    <div className="List-style--none Margin-left--80">
                      {menteeData.workshops.map((workshop, index) => (
                        <div
                          key={index}
                          className="Text-fontSize--16 Text-color--gray-600 Margin-bottom--24 Flex-row Align-items--center"
                        >
                          <div
                            className="Background-color--teal-1000 Border--rounded Margin-right--16"
                            style={{
                              width: "8px",
                              height: "8px",
                              flexShrink: 0,
                            }}
                          />
                          {workshop}
                        </div>
                      ))}
                    </div>
                    <div className="Button Button-color--teal-1000 Border-radius--4 Text-color--white Margin-top--32 Margin-left--80">
                      Assign New Courses
                    </div>
                  </div>
                )}

                {activeTab === "Meetings" && (
                  <div>
                    <div
                      className="Text-fontSize--16 Text-color--gray-800 Margin-left--60 Margin-bottom--20"
                      style={{
                        borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
                        paddingBottom: "10px",
                      }}
                    >
                      Upcoming
                    </div>
                    <div className="Margin-top--20 ">
                      <div className="Flex-row Margin-bottom--10 Margin-left--60">
                        <div
                          className="Margin-right--40"
                          style={{ textAlign: "center", width: "40px" }}
                        >
                          <div className="Text-color--gray-800">wed</div>
                          <div className="Text-fontSize--30 Text-color--gray-1000">
                            25
                          </div>
                        </div>
                        <div>
                          <div className="Text-fontSize--16 Text-color--gray-1000">
                            Mock Interview Session
                          </div>
                          <div className="Text-fontSize--14 Text-color--gray-800">
                            Practice your interview skills with an industry
                            professional
                          </div>
                        </div>
                      </div>
                      <div className="Flex-row Margin-bottom--10 Margin-left--60">
                        <div className="Button Button-color--teal-1000 Border-radius--4 Text-color--white Margin-top--32 Margin-left--80"
                        onClick={() => {
                          navigate("/create-meeting");
                        }}>
                          Add New Meeting Notes
                        </div>
                        
                      </div>
                    </div>

                    <div
                      className="Text-fontSize--16 Text-color--gray-800 Margin-left--60 Margin-bottom--20"
                      style={{
                        borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
                        paddingBottom: "10px",
                      }}
                    >
                      Past
                    </div>
                    <div className="Margin-top--20 ">
                      <div className="Flex-row Margin-bottom--10 Margin-left--60">
                        <div
                          className="Margin-right--40"
                          style={{ textAlign: "center", width: "40px" }}
                        >
                          <div className="Text-color--gray-800">wed</div>
                          <div className="Text-fontSize--30 Text-color--gray-1000">
                            25
                          </div>
                        </div>
                        <div>
                          <div className="Text-fontSize--16 Text-color--gray-1000">
                            Mock Interview Session
                          </div>
                          <div className="Text-fontSize--14 Text-color--gray-800">
                            Practice your interview skills with an industry
                            professional
                          </div>
                        </div>
                      </div>
                      <div className="Flex-row Margin-bottom--10 Margin-left--60">
                        <div className="Button Button-color--teal-1000 Border-radius--4 Text-color--white Margin-top--32 Margin-left--80">
                          Add New Meeting Notes
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Schedule New" && (
                  <div>
                    <div
                      className="Text-fontSize--18 Text-color--gray-800 Margin-left--60 Margin-bottom--20"
                      style={{
                        borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
                        paddingBottom: "10px",
                      }}
                    >
                      Schedule A New Meeting
                    </div>
                    <div className="Flex-row Margin-bottom--20 Margin-left--60">
                      <div className="Text-fontSize--16 Text-color--gray-600">
                        Date:
                      </div>
                    </div>
                    <div className="Flex-row Margin-bottom--20 Margin-left--60">
                      <div className="Text-fontSize--16 Text-color--gray-600">
                        Time:
                      </div>
                    </div>
                    <div className="Flex-row Margin-bottom--40 Margin-left--60">
                      <div className="Text-fontSize--16 Text-color--gray-600">
                        Description:
                      </div>
                    </div>
                    <div className="Flex-row Margin-bottom--40 Margin-left--60">
                      <div className=" Button Button-color--teal-1000 Border-radius--4 Text-color--white Margin-top--32 Margin-left--80">
                        Schedule Meeting
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeInformation;
