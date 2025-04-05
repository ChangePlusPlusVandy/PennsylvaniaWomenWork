import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal"
import CreateEventModal from "../components/CreateEvent"
import Event, { EventData } from "../components/Event"
import { useUser } from "../contexts/UserContext"
import { api } from "../api"
import { tier1Roles, tier2Roles, tier3Roles } from "../utils/roles"

interface Mentee {
  _id: string
  first_name: string
  last_name: string
  email: string
}

interface CourseInformationElements {
  _id: string
  name: string
  description: string
  s3id: string
  createdAt: string
  mentor: string
  mentee: string
}

const MentorDashboard = () => {
  const navigate = useNavigate()
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("My Mentees")
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [createEventModal, setCreateEventModal] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const { user } = useUser()
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([])
  const userId = user?._id
  useEffect(() => {
    if (!user) {
      return
    }

    const fetchUserEvents = async () => {
      try {
        const response = await api.get(`/api/event/${userId}`)
        setEvents(response.data)
      } catch (err) {
        console.log("Failed to load events.")
      }
    }

    if (
      !userId ||
      (user.role !== "mentor" && user.role !== "staff" && user.role !== "board")
    ) {
      console.log("Only mentors can view mentees.")
      setLoading(false)
      return
    }
    console.log("userId", userId)

    const fetchMentees = async () => {
      try {
        const endpoint =
          user.role === "staff"
            ? "/api/mentee/all-mentees"
            : `/api/mentor/${user._id}/mentees`

        const response = await api.get(endpoint)

        const menteeData =
          user.role === "staff"
            ? response.data // getAllMentees returns array directly
            : response.data.mentees // getMenteesForMentor returns {mentees: [...]}

        setMentees(Array.isArray(menteeData) ? menteeData : [])
        console.log("menteeData", menteeData)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    }
    fetchUserEvents()
    fetchMentees()
  }, [user, userId])

  // call endpoint to get all workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await api.get(`/api/workshop/get-workshops`)
        setWorkshops(response.data)
      } catch (err) {
        console.log("Unable to fetch workshops.")
      }
    }
    fetchWorkshops()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const eventsByMonth: { [key: string]: EventData[] } = events
    .filter((event) => new Date(event.date) >= today)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ) // Sort events chronologically
    .reduce(
      (acc, event) => {
        const eventDate = new Date(event.date)
        const month = eventDate.toLocaleString("default", { month: "long" })

        if (!acc[month]) {
          acc[month] = []
        }
        acc[month].push({
          ...event,
          formattedDate: eventDate.toDateString(),
        })

        return acc
      },
      {} as { [key: string]: EventData[] }
    )

  const handleClick = (menteeId: string) => {
    navigate("/mentor/mentee-information", { state: { menteeId } })
  }

  const handleClickWorkshop = (id: string) => {
    navigate("/mentor/workshop-information", { state: { workshopId: id } })
  }

  const handleCreateEvent = async (eventData: {
    name: string
    description: string
    date: string
    startTime: string
    endTime: string
    // userIds: string[];
    roles: string[]
    calendarLink?: string
  }) => {
    try {
      const response = await api.post(`/api/event`, eventData)
      console.log(response.data.event)

      setEvents((prev) => [...prev, response.data.event])
      setCreateEventModal(false)
    } catch (error) {
      console.log("Error creating event.")
    }
  }

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event)
  }

  useEffect(() => {
    if (user?.role === "board") {
      setActiveTab("Courses")
    }
  }, [user?.role])

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={`${new Date(selectedEvent.date).toLocaleString("default", { month: "long" })} ${new Date(selectedEvent.date).getDate()}, ${new Date(selectedEvent.date).getFullYear()} ${new Date(selectedEvent.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} - ${new Date(selectedEvent.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
          body={
            <>
              {selectedEvent.description}
              <div>
                <a
                  href={selectedEvent.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to Calendar
                </a>
              </div>
            </>
          }
          action={() => setSelectedEvent(null)}
        />
      )}

      {createEventModal && (
        <CreateEventModal
          isOpen={createEventModal}
          onClose={() => setCreateEventModal(false)}
          onSubmit={handleCreateEvent} // Pass event creation function
        />
      )}
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="Block">
              <div className="Block-header">
                <div className="Flex-row">
                  {user?.role === "board" ? (
                    // Board members only see Courses tab
                    <div
                      onClick={() => setActiveTab("Courses")}
                      className={`tab ${activeTab === "Courses" ? "active" : ""}`}
                    >
                      Courses
                    </div>
                  ) : (
                    // Other roles see both tabs
                    ["My Mentees", "Courses"].map((tab) => (
                      <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                      >
                        {tab === "My Mentees" && user?.role === "staff"
                          ? "All Mentees"
                          : tab}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="Block-subtitle" />

              {activeTab === "My Mentees" && (
                <div>
                  {loading ? (
                    <p>Loading mentees...</p>
                  ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                  ) : mentees.length > 0 ? (
                    <div className="row gx-3 gy-3">
                      {mentees.map((mentee) => (
                        <div className="col-lg-4" key={mentee._id}>
                          <div
                            className="Mentor--card"
                            onClick={() => handleClick(mentee._id)}
                          >
                            <div className="Mentor--card-color Background-color--teal-1000" />
                            <div className="Padding--10">
                              <div className="Mentor--card-name">
                                {mentee.first_name} {mentee.last_name}
                              </div>
                              <div className="Mentor--card-description">
                                {mentee.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No mentees found.</p>
                  )}
                </div>
              )}

              {activeTab === "Courses" && (
                <div className="row gx-3 gy-3">
                  {workshops.map((item) => (
                    <div className="col-lg-4" key={item._id}>
                      <div
                        className="Mentor--card"
                        onClick={() => handleClickWorkshop(item._id)}
                      >
                        <div className="Mentor--card-color Background-color--teal-1000" />
                        <div className="Padding--10">
                          <div className="Mentor--card-name">{item.name}</div>
                          <div className="Mentor--card-description">
                            {item.description}
                          </div>
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
                  onEventClick={handleEventClick}
                />
              ))}

              {user && tier1Roles.includes(user.role) && (
                <div
                  className="Button Button-color--blue-1000"
                  onClick={() => {
                    setCreateEventModal(true)
                  }}
                >
                  Add New Event
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MentorDashboard
