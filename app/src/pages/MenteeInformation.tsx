import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Image from "../assets/image.jpg"

const MenteeInformation = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Workshops")

  const menteeData = {
    name: "Jane Doe",
    role: "Marketing",
    description:
      "Lorem ipsum dolor sit amet consectetur. In lectus et et pellentesque a mattis. Sapien morbi congue nulla diam sit non at. Arcu platea semper fermentum at fusce. Eu sem varius molestie elit venenatis. Nulla est sollicitudin.",
    workshops: ["Resume Prep", "Career Advancement", "Resume Workshop"],
  }

  return (
    <>
      <Navbar />
      <div className="Flex-row Justify-content--spaceBetween">
        <div className="Mentee-info-block">
          <div className="Width--60">
            <div className="Flex-row--mentee-info">
              <div>
                <div className="Mentee-name--text">
                  {menteeData.name}
                </div>
                <div className="Mentee-role--text">
                  {menteeData.role}
                </div>
              </div>
            </div>

            <div className="Flex-row--mentee-description">
              <div className="Mentee-info--text">
                Information
              </div>
            </div>
            <div className="Flex-row--mentee-bio">
              <div className="Mentee-description--text">
                {menteeData.description}
              </div>
            </div>

            <div>
              <div>
                <div className="Flex-row--mentee-tabs">
                  {["Workshops", "Meetings", "Schedule New"].map((tab) => (
                    <div
                      key={tab}
                      className = {`Mentee-tabs__tab ${activeTab === tab ? 'Mentee-tabs__tab--active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                {activeTab === "Workshops" && (
                  <div>
                    <div
                      className="Workshop-header"
                    >
                      Current Workshops
                    </div>
                    <div className="List-style--none Margin-left--80">
                      {menteeData.workshops.map((workshop, index) => (
                        <div
                          key={index}
                          className="Course-list-element"
                        >
                          <div
                            className="Course-list-bullet"
                          />
                          {workshop}
                        </div>
                      ))}
                    </div>
                    <div className="Button Button-color--teal-1000 Margin-left--80">
                      Assign New Courses
                    </div>
                  </div>
                )}

                {activeTab === "Meetings" && (
                  <div>
                    <div
                      className="Calendar-upcoming"
                    >
                      Upcoming
                    </div>
                      <div className="Flex-row-calendar">
                        <div
                          className="Calendar-block"
                        >
                          <div className="Calendar-day">wed</div>
                          <div className="Calendar-date">
                            25
                          </div>
                        </div>
                        <div>
                          <div className="Calendar-event">
                            Mock Interview Session
                          </div>
                          <div className="Calendar-description">
                            Practice your interview skills with an industry
                            professional
                          </div>
                        </div>
                      </div>
                      <div className="Flex-row-calendar">
                        <div
                          className="Button Button-color--teal-1000 Width--40"
                          onClick={() => {
                            navigate("/create-meeting")
                          }}
                        >
                          Add New Meeting Notes
                        </div>
                      </div>
                    <div
                      className="Calendar-upcoming"
                    >
                      Past
                    </div>
                      <div className="Flex-row-calendar">
                        <div
                          className="Calendar-block"
                        >
                          <div className="Calendar-day">wed</div>
                          <div className="Calendar-date">
                            25
                          </div>
                        </div>
                        <div>
                          <div className="Calendar-event">
                            Mock Interview Session
                          </div>
                          <div className="Calendar-description">
                            Practice your interview skills with an industry
                            professional
                          </div>
                        </div>
                      </div>
                      <div className="Flex-row-calendar">
                        <div className="Button Button-color--teal-1000 Width--40">
                          Add New Meeting Notes
                        </div>
                      </div>
                  </div>
                )}

                {activeTab === "Schedule New" && (
                  <div>
                    <div
                      className="Workshop-header"
                    >
                      Schedule A New Meeting
                    </div>
                    <div className="Flex-row-meeting-info">
                      <div className="Meeting-info--text">
                        Date:
                      </div>
                    </div>
                    <div className="Flex-row-meeting-info">
                      <div className="Meeting-info--text">
                        Time:
                      </div>
                    </div>
                    <div className="Flex-row-meeting-info">
                      <div className="Meeting-info--text">
                        Description:
                      </div>
                    </div>
                    <div className="Flex-row-meeting-info--description">
                      <div className="Button Button-color--teal-1000 Margin-left--80">
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
  )
}

export default MenteeInformation
