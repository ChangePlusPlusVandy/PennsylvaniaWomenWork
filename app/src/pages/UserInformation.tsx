import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Icon from "../components/Icon"
import Modal from "../components/Modal"
import { Formik, Form, Field } from "formik"
import * as yup from "yup"
import { api } from "../api"
import { useUser } from "../contexts/UserContext"
import { toast } from "react-hot-toast"
import { set } from "react-hook-form"
import { useProfileImage } from "../utils/custom-hooks"
import ConfirmActionModal from "../components/ConfirmActionModal"
import { Spinner } from "react-bootstrap"
import Event, {
  EventData,
  parseEvents,
  groupEventsByMonth,
  formatEventSubheader,
} from "../components/Event"

interface Workshop {
  _id: string
  name: string
  description: string
  mentor: string
  mentees: string[]
}

interface MenteeInfo {
  _id: string
  first_name: string
  last_name: string
  email: string
  role: "mentee" | "mentor" | "staff" | "board" // Explicitly define possible roles
  mentor?: string
  workshops: string[] // Array of workshop names
  profile_picture_id: string | null
}

interface MentorInfo {
  _id: string
  first_name: string
  last_name: string
  email: string
  profile_picture_id: string | null
}

const MenteeInformation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?._id
  const [currUser, setCurrUser] = useState<MenteeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModal, setIsModal] = useState(false)
  const { user } = useUser()
  const [availableWorkshops, setAvailableWorkshops] = useState([])
  const [assignedWorkshops, setAssignedWorkshops] = useState<Workshop[]>([])
  const [mentors, setMentors] = useState<MentorInfo[]>([])
  const [mentorInfo, setMentorInfo] = useState<MentorInfo | null>(null)
  const [isAssignMentorModal, setIsAssignMentorModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const profileImage = useProfileImage(currUser?.profile_picture_id)
  const [mentees, setMentees] = useState<MenteeInfo[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)

  const roleMap: Record<string, string> = {
    board: "Board Member",
    mentee: "Participant",
    mentor: "Volunteer",
    staff: "Staff Member",
  }

  const roleType = currUser?.role ? roleMap[currUser.role] : "User"

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/api/user/${userId}`)
        setCurrUser(data)
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    if (userId) fetch()
  }, [userId])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.post("/api/event/meetings-between-users", {
          user1Id: user?._id,
          user2Id: userId,
        })
        setEvents(response.data)
      } catch (err) {
        console.error("Failed to fetch events:", err)
      }
    }

    if (user?._id && userId) {
      fetchEvents()
    }
  }, [user?._id, userId])

  useEffect(() => {
    const fetchMenteeData = async () => {
      try {
        const menteeResponse = await api.get(`/api/mentee/get-mentee/${userId}`)
        setCurrUser(menteeResponse.data)

        if (menteeResponse.data.mentor_id) {
          const mentorRes = await api.get(
            `/api/mentor/mentor-for-mentee/${menteeResponse.data._id}`
          )
          setMentorInfo(mentorRes.data)
        }

        const workshopsResponse = await api.get(
          `/api/mentee/${userId}/workshops`
        )
        setAssignedWorkshops(workshopsResponse.data)
      } catch (err) {
        setError("Failed to load mentee details.")
        console.error("Error fetching mentee data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (currUser?.role === "mentee" && userId) fetchMenteeData()
  }, [userId, currUser?.role])

  useEffect(() => {
    const fetchMenteesForMentor = async () => {
      try {
        const response = await api.get(`/api/mentor/${userId}/mentees`)
        setMentees(response.data.mentees) // 👈 extract the actual array
      } catch (err) {
        console.error("Failed to fetch mentees for mentor:", err)
      }
    }

    if (currUser?.role === "mentor" && userId) {
      fetchMenteesForMentor()
    }
  }, [currUser?.role, userId])

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const mentorId = currUser?.mentor
        if (!mentorId) return

        const response = await api.get(`/api/mentor/get-mentor/${mentorId}`)
        setMentorInfo(response.data)
      } catch (err) {
        setError("Failed to load mentor details.")
        console.error("Error fetching mentor data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (currUser?.role === "mentee") fetchMentorData()
  }, [currUser?.role, currUser?.mentor])

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await api.get("/api/workshop/get-workshops")
        setAvailableWorkshops(response.data)
      } catch (err) {
        console.error("Error fetching workshops:", err)
      }
    }
    if (currUser?.role === "mentee") fetchWorkshops()
  }, [currUser?.role])

  // i only want to do this if this is a staff member
  useEffect(() => {
    // pull in all mentors
    const fetchMentors = async () => {
      try {
        const response = await api.get("/api/mentor/all-mentors")
        setMentors(response.data)
        return response.data
      } catch (err) {
        console.error("Error fetching mentors:", err)
      }
    }
    fetchMentors()
  }, [userId])

  const initialValues = {
    courseName: "",
  }

  const validationSchema = yup.object({
    courseName: yup.string().required("Course selection is required"),
  })

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    try {
      if (!userId) {
        console.error("Mentee ID is missing.")
        setSubmitting(false)
        return
      }

      console.log(
        "Assigning workshop:",
        values.courseName,
        "to mentee:",
        userId
      )

      const payload = {
        workshopId: values.courseName,
      }

      console.log("Sending payload:", payload)

      const response = await api.put(
        `/api/mentee/${userId}/add-workshop`,
        payload
      )

      console.log("Assignment response:", response)

      if (response.status === 200) {
        toast.success("Workshop assigned successfully!")
        const updatedMentee = await api.get(`/api/mentee/get-mentee/${userId}`)
        setCurrUser(updatedMentee.data)
        setIsModal(false)
      } else {
        throw new Error("Failed to assign workshop")
      }
    } catch (error) {
      console.error("Error assigning workshop:", error)
      toast.error("Failed to assign workshop")
    } finally {
      setSubmitting(false)
    }
  }
  const mentorInitialValues = {
    mentorName: "",
  }

  const mentorValidationSchema = yup.object({
    mentorName: yup.string().required("Volunteer selection is required"),
  })
  const handleMentorSubmit = async (
    values: typeof mentorInitialValues,
    { setSubmitting }: any
  ) => {
    try {
      if (!userId) {
        toast.error("No mentee selected")
        setSubmitting(false)
        return
      }

      const response = await api.put(
        `/api/mentor/${values.mentorName}/assign-mentee`,
        {
          menteeId: userId,
        }
      )

      if (response.status === 200) {
        toast.success("Mentor assigned successfully")
        // Refresh mentee data to show new mentor
        const menteeResponse = await api.get(`/api/user/${userId}`)
        setCurrUser(menteeResponse.data)
      }

      setIsAssignMentorModal(false)
    } catch (error) {
      console.error("Error assigning mentor:", error)
      toast.error("Failed to assign mentor")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event)
  }

  // Compute initials for the mentee's avatar
  const getInitials = () => {
    if (!currUser) return ""
    return (
      currUser.first_name.charAt(0).toUpperCase() +
      currUser.last_name.charAt(0).toUpperCase()
    )
  }

  // event logic
  const eventsByMonth = groupEventsByMonth(events)
  const monthsWithEvents = Object.entries(eventsByMonth).filter(
    ([_, events]) => events.length > 0
  )

  if (loading) {
    ;<Spinner />
  }

  if (error) {
    return <div>{error}</div>
  }

  const handleDeleteMentee = async (userId: string) => {
    try {
      await api.delete(`/api/mentee/delete-mentee/${userId}`)
      navigate("/home")
    } catch (err) {
      toast.error("Failed to delete mentee.")
    } finally {
      toast.success("Mentee deleted successfully.")
      setDeleteModal(false)
    }
  }

  return (
    <>
      {deleteModal && (
        <ConfirmActionModal
          isOpen={deleteModal}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmLabel="Delete Volunteer"
          onConfirm={() => handleDeleteMentee(userId)}
          onCancel={() => setDeleteModal(false)}
          isDanger
        />
      )}
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={selectedEvent ? formatEventSubheader(selectedEvent) : ""}
          body={
            <div className="Flex-column">
              {selectedEvent.description}

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
                  Go to Link
                </a>
              )}
            </div>
          }
          action={() => setSelectedEvent(null)}
        />
      )}
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {/* Back Button */}
          <div
            className="col-lg-12 mb-4"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>

          {/* if there is no userId in the store, display message */}

          {!userId ? (
            <div className="col-lg-12 ">No particpant selected.</div>
          ) : (
            <>
              {/* Mentee Information Header */}
              {/* Column 1: Mentee Information Block */}
              <div className="col-lg-4 mb-4">
                <div className="Block">
                  <div className="Block-header">{roleType} Information</div>
                  <div className="Block-subtitle">{roleType} Details</div>
                  <div className="Block-content">
                    <div className="Profile-avatar">
                      {profileImage ? (
                        <div
                          className="Profile-avatar-image"
                          style={{
                            backgroundImage: `url(${profileImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      ) : (
                        <div className="Profile-initials">{getInitials()}</div>
                      )}
                    </div>
                    <div className="Profile-field">
                      <div className="Profile-field-label">Name:</div>
                      <div>
                        {currUser?.first_name} {currUser?.last_name}
                      </div>
                    </div>
                    <div className="Profile-field">
                      <div className="Profile-field-label">Role:</div>
                      <div>{currUser?.role}</div>
                    </div>
                    <div className="Profile-field">
                      <div className="Profile-field-label">Email:</div>
                      <div>{currUser?.email}</div>
                    </div>
                    {currUser?.role === "mentee" && (
                      <>
                        {mentorInfo ? (
                          <>
                            <label>Volunteer:</label>
                            <div className="Profile-field">
                              <div
                                className="Profile-field-label"
                                style={{ fontWeight: "500" }}
                              >
                                Name:
                              </div>
                              <div>
                                {mentorInfo.first_name} {mentorInfo.last_name}
                              </div>
                            </div>
                            <div className="Profile-field">
                              <div
                                className="Profile-field-label"
                                style={{ fontWeight: "500" }}
                              >
                                Email:
                              </div>
                              <div>{mentorInfo.email}</div>
                            </div>
                            {user?.role === "staff" && (
                              <div
                                className="Button Button-color--blue-1000"
                                onClick={() => setIsAssignMentorModal(true)}
                                style={{ marginTop: "1rem" }}
                              >
                                Change Volunteer
                              </div>
                            )}
                          </>
                        ) : (
                          user?.role === "staff" && (
                            <div
                              className="Button Button-color--blue-1000"
                              onClick={() => setIsAssignMentorModal(true)}
                            >
                              Assign Volunteer
                            </div>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Column 2: Mentee Courses */}
              <div className="col-lg-4 mb-4">
                {roleType === "Participant" && (
                  <div className="Block Margin-bottom--20">
                    <div className="Block-header">{roleType} Files</div>
                    <div className="Block-subtitle">
                      Folders assigned to {currUser?.first_name}
                    </div>
                    {assignedWorkshops.length > 0 ? (
                      <div className="Flex-col">
                        {assignedWorkshops.map((workshop) => (
                          <div key={workshop._id} className="Profile-field">
                            {workshop.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No folders assigned.</p>
                    )}
                    {user?.role === "staff" && (
                      <button
                        className="Button Button-color--blue-1000 Width--100"
                        onClick={() => setIsModal(true)}
                      >
                        Assign New Course
                      </button>
                    )}
                  </div>
                )}
                {roleType === "Volunteer" && (
                  <div className="Block Margin-bottom--20">
                    <div className="Block-header">Assigned Mentees</div>
                    <div className="Block-subtitle">
                      Mentees working with {currUser?.first_name}
                    </div>
                    {(mentees ?? []).length > 0 ? (
                      <div className="Flex-col">
                        {mentees.map((mentee) => (
                          <div key={mentee._id} className="Profile-field">
                            {mentee.first_name} {mentee.last_name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No mentees assigned.</p>
                    )}
                  </div>
                )}

                <div className="Block">
                  <div className="Block-header">Delete {roleType}</div>
                  <div className="Block-subtitle">
                    Permanently remove this {roleType} from the network.
                  </div>
                  <button
                    className="Button Button-color--red-1000 Button--hollow Width--100"
                    onClick={() => {
                      setDeleteModal(true)
                    }}
                  >
                    Delete {roleType}
                  </button>
                </div>
              </div>
              {/* Column 3: Upcoming Meetings */}
              <div className="col-lg-4 mb-4">
                <div className="Block">
                  <div className="Block-header">Upcoming Meetings</div>
                  <div className="Block-subtitle">
                    Your meetings with {currUser?.first_name}
                  </div>
                  {monthsWithEvents.length === 0 ? (
                    <div className="Text--center">No upcoming events</div>
                  ) : (
                    monthsWithEvents.map(([month, monthEvents]) => (
                      <Event
                        key={month}
                        month={month}
                        events={monthEvents}
                        onEventClick={handleEventClick}
                      />
                    ))
                  )}
                  <button
                    className="Button Button-color--blue-1000 Margin-top--20 Width--100"
                    onClick={() => navigate("/create-meeting")}
                  >
                    Add New Meeting
                  </button>
                </div>
              </div>{" "}
            </>
          )}
        </div>
      </div>
      {isAssignMentorModal && (
        <Modal
          header={`Assign a volunteer for ${currUser?.first_name} ${currUser?.last_name}`}
          action={() => setIsAssignMentorModal(false)}
          body={
            <Formik
              initialValues={mentorInitialValues}
              validationSchema={mentorValidationSchema}
              onSubmit={handleMentorSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="mentorName">Select Volunteer</label>
                    <Field
                      as="select"
                      className="Form-input-box"
                      id="mentorName"
                      name="mentorName"
                    >
                      <option value="">Select a volunteer...</option>
                      {mentors.map((mentor: MentorInfo) => (
                        <option key={mentor._id} value={mentor._id}>
                          {mentor.first_name} {mentor.last_name}
                        </option>
                      ))}
                    </Field>
                    {errors.mentorName && touched.mentorName && (
                      <div className="Form-error">{errors.mentorName}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="Button Button-color--teal-1000 Width--100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Assigning..." : "Assign Volunteer"}
                  </button>
                </Form>
              )}
            </Formik>
          }
        />
      )}
      {isModal && (
        <Modal
          header="Assign New Course"
          subheader="Add a new course for this mentee"
          action={() => setIsModal(false)}
          body={
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="courseName">Select Workshop</label>
                    <Field
                      as="select"
                      className="Form-input-box"
                      id="courseName"
                      name="courseName"
                    >
                      <option value="">Select a workshop...</option>
                      {availableWorkshops.map((workshop: any) => (
                        <option key={workshop._id} value={workshop._id}>
                          {workshop.name}
                        </option>
                      ))}
                    </Field>
                    {errors.courseName && touched.courseName && (
                      <div className="Form-error">{errors.courseName}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="Button Button-color--teal-1000 Width--100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Assigning..." : "Assign Workshop"}
                  </button>
                </Form>
              )}
            </Formik>
          }
        />
      )}
    </>
  )
}

export default MenteeInformation
