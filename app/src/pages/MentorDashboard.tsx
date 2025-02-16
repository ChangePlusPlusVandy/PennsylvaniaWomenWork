import React, { useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal"
import CreateEventModal from "../components/CreateEvent"
import Event, { EventData } from "../components/Event"

interface MenteeInformationElements {
  id: number
  menteeName: string
}

interface CourseInformationElements {
  id: number
  courseName: string
}

const handleClick = (item: MenteeInformationElements) => {
  console.log("Clicked:", item)
}

const MentorDashboard = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("My Mentees")
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [createEventModal, setCreateEventModal] = useState(false)

  const events: EventData[] = [
    {
      id: 1,
      day: "wed",
      date: "25",
      month: "June",
      title: "Meeting with Jane",
      description: "One-on-one meeting with Jane to discuss her career goals",
      fullDescription:
        "One-on-one meeting with Jane to discuss her career goals.",
    },
    {
      id: 2,
      day: "fri",
      date: "27",
      month: "June",
      title: "Meeting with John",
      description: "One-on-one meeting with John to discuss his career goals",
      fullDescription:
        "One-on-one meeting with John to discuss his career goals.",
    },
    {
      id: 3,
      day: "mon",
      date: "1",
      month: "July",
      title: "Mentor Networking Event",
      description: "Connecting with other mentors and industry professionals",
      fullDescription:
        "Discussion with other mentors and industry professionals about their work, best practices, and more.",
    },
  ]

  const eventsByMonth: { [key: string]: EventData[] } = events.reduce(
    (acc, event) => {
      if (!acc[event.month]) {
        acc[event.month] = []
      }
      acc[event.month].push(event)
      return acc
    },
    {} as { [key: string]: EventData[] }
  )

  const menteeGridData: MenteeInformationElements[] = [
    {
      id: 1,
      menteeName: "Jane Doe",
    },
    {
      id: 2,
      menteeName: "John Doe",
    },
  ]

  const courseGridData: CourseInformationElements[] = [
    {
      id: 1,
      courseName: "Resume",
    },
  ]

  const handleClick = (id: number) => {
    navigate(`/mentor/mentee-information/`)
  }

  const handleClickWorkshop = (id: number) => {
    navigate(`/mentor/workshop-information/`)
  }

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.title}
          subheader={`${selectedEvent.day.toUpperCase()}, ${selectedEvent.month} ${selectedEvent.date}`}
          body={<>{selectedEvent.fullDescription}</>}
          action={() => setSelectedEvent(null)}
        />
      )}

      {createEventModal && (
        <CreateEventModal
          isOpen={createEventModal}
          onClose={() => setCreateEventModal(false)}
        />
      )}

      <div className="row g-3 Margin--20">
        <div className="col-lg-8">
          <div className="Block p-3">
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
                <div className="row gx-3 gy-3">
                  {menteeGridData.map((item) => (
                    <div className="col-lg-4" key={item.id}>
                      <div
                        className="Mentor--card"
                        onClick={() => handleClick(item.id)}
                      >
                        <div className="Mentor--card-color Background-color--teal-1000" />
                        <div className="Padding--10">
                          <h3 className="Text-fontSize--20 Text-color--gray-600">
                            {item.menteeName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Courses" && (
              <div className="row gx-3 gy-3">
                {courseGridData.map((item) => (
                  <div className="col-lg-4" key={item.id}>
                    <div
                      className="Mentor--card"
                      onClick={() => handleClickWorkshop(item.id)}
                    >
                      <div className="Mentor--card-color Background-color--teal-1000" />
                      <div className="Padding--10">
                        <h3 className="Text-fontSize--20 Text-color--gray-600">
                          {item.courseName}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="Block p-3">
            <div className="Block-header">Upcoming Events</div>
            <div className="Block-subtitle">
              Scheduled meetings and workshops
            </div>
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <Event
                key={month}
                month={month}
                events={monthEvents}
                onEventClick={setSelectedEvent}
              />
            ))}
            <div
              className="Button Button-color--blue-1000"
              onClick={() => {
                setCreateEventModal(true)
              }}
            >
              Add New Event
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentorDashboard
