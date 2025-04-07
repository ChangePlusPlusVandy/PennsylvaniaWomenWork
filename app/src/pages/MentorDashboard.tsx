import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal"
import CreateEventModal from "../components/CreateEvent"
import Event, { EventData } from "../components/Event"
import { useUser } from "../contexts/UserContext"
import { api } from "../api"
import { tier1Roles, tier2Roles, tier3Roles } from "../utils/roles"
import ParticipantCard from "../components/ParticipantCard"

interface Mentee {
  _id: string
  first_name: string
  last_name: string
  email: string
}

interface Mentor {
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
  coverImageS3id: string
}

type ImageUrlMap = Record<string, string | null>

const MentorDashboard = () => {
  const navigate = useNavigate()
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [createEventModal, setCreateEventModal] = useState(false)
  const [events, setEvents] = useState<EventData[]>([])
  const { user } = useUser()
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([])
  const userId = user?._id
  const [imageUrls, setImageUrls] = useState<ImageUrlMap>({})
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "My Mentees"
  })

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
        fetchImageUrls(response.data)
      } catch (err) {
        console.log("Unable to fetch folders.")
      }
    }
    fetchWorkshops()
  }, [])

  useEffect(() => {
    const fetchMentors = async () => {
      if (user?.role === "staff" || user?.role === "board") {
        try {
          const response = await api.get(`/api/mentor/all-mentors`)
          setMentors(response.data)
        } catch (err) {
          console.error("Unable to fetch mentors.")
        }
      }
    }

    fetchMentors()
  }, [user])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const fetchImageUrls = async (workshopsData: any) => {
    const urls: ImageUrlMap = {}

    await Promise.all(
      workshopsData.map(async (item: any) => {
        if (item.coverImageS3id) {
          try {
            const res = await api.get(
              `/api/resource/getURL/${item.coverImageS3id}`
            )
            urls[item.coverImageS3id] = res.data.signedUrl
          } catch (error) {
            console.error(
              `Error fetching image for ${item.coverImageS3id}:`,
              error
            )
            urls[item.coverImageS3id] = null
          }
        }
      })
    )

    setImageUrls(urls)
  }

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
    navigate("/volunteer/participant-information", { state: { menteeId } })
  }

  const handleClickWorkshop = (id: string) => {
    navigate("/volunteer/workshop-information", { state: { workshopId: id } })
  }

  const handleCreateEvent = async (eventData: {
    name: string
    description: string
    date: string
    startTime: string
    endTime: string
    userIds?: string[]
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

  const handleMentorClick = (volunteerId: string) => {
    console.log("Mentor ID:", volunteerId)
    navigate("/particpant/participant-information", {
      state: { volunteerId },
    })
  }

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab")
    if (!storedTab) {
      if (user?.role === "board") {
        handleTabClick("Files")
      } else if (user?.role === "mentor" || user?.role === "staff") {
        handleTabClick("My Participants")
      }
    }
  }, [user?.role])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem("activeTab", tab)
  }

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={`${new Date(selectedEvent.date).toLocaleString("default", { month: "long" })} ${new Date(selectedEvent.date).getDate()}, ${new Date(selectedEvent.date).getFullYear()} ${new Date(selectedEvent.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} - ${new Date(selectedEvent.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
          body={
            <div className="Flex-column">
              {selectedEvent.description}
              <div className="Button Button-color--red-1000 Margin-top--10 Button--hollow">
                Delete Event
              </div>
              {selectedEvent.calendarLink && (
                <a
                  href={selectedEvent.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Button Button-color--blue-1000 Margin-top--10"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Add to Calendar
                </a>
              )}
            </div>
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
                      onClick={() => handleTabClick("Files")}
                      className={`tab ${activeTab === "Files" ? "active" : ""}`}
                    >
                      Files
                    </div>
                  ) : (
                    // Other roles see both tabs
                    [
                      "My Participants",
                      ...(user?.role === "staff" || user?.role === "board"
                        ? ["All Volunteers"]
                        : []),
                      "Files",
                    ].map((tab) => (
                      <div
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                      >
                        {tab === "My Participants" && user?.role === "staff"
                          ? "All Participants"
                          : tab}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="Block-subtitle" />

              {activeTab === "My Participants" && (
                <div>
                  {loading ? (
                    <p>Loading mentees...</p>
                  ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                  ) : mentees.length === 0 ? (
                    <p>No participants found.</p>
                  ) : (
                    <div className="row gx-3 gy-3">
                      {mentees.map((mentee) => (
                        <div className="col-lg-6" key={mentee._id}>
                          <ParticipantCard
                            firstName={mentee.first_name}
                            lastName={mentee.last_name}
                            email={mentee.email}
                            profilePictureId={
                              (mentee as any).profile_picture_id
                            } // cast if type doesn't include it
                            onClick={() => handleClick(mentee._id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(user?.role === "staff" || user?.role === "board") &&
                activeTab === "All Volunteers" && (
                  <div>
                    {mentors.length > 0 ? (
                      <div className="row gx-3 gy-3">
                        {mentors.map((mentor) => (
                          <div className="col-lg-4" key={mentor._id}>
                            <ParticipantCard
                              firstName={mentor.first_name}
                              lastName={mentor.last_name}
                              email={mentor.email}
                              profilePictureId={
                                (mentor as any).profile_picture_id
                              }
                              onClick={() => handleMentorClick(mentor._id)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No mentors found.</p>
                    )}
                  </div>
                )}

              {activeTab === "Files" && (
                <div className="row gx-3 gy-3">
                  {workshops.map((item) => (
                    <div className="col-lg-4" key={item._id}>
                      <div
                        className="Mentor--card"
                        onClick={() => handleClickWorkshop(item._id)}
                      >
                        {imageUrls[item.coverImageS3id] ? (
                          <div
                            className="Mentor--card-image"
                            style={{
                              backgroundImage: `url(${imageUrls[item.coverImageS3id]})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              height: "120px",
                            }}
                          />
                        ) : (
                          <div className="Mentor--card-color Background-color--teal-1000" />
                        )}
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
                Scheduled meetings and events.
              </div>
              {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                <Event
                  key={month}
                  month={month}
                  events={monthEvents}
                  onEventClick={handleEventClick}
                />
              ))}

              <div
                className="Flex-row Align-items--center Width--100 Margin-top--10"
                style={{ gap: "10px" }}
              >
                {user && tier1Roles.includes(user.role) && (
                  <div
                    className="Button Button-color--blue-1000"
                    onClick={() => {
                      setCreateEventModal(true)
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    Add New Event
                  </div>
                )}

                {user &&
                  (tier1Roles.includes(user.role) ||
                    user.role === "mentor") && (
                    <div
                      className="Button Button-color--blue-1000 "
                      onClick={() => navigate("/create-meeting")}
                      style={{ flexGrow: 1 }}
                    >
                      Schedule Meeting
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

export default MentorDashboard
