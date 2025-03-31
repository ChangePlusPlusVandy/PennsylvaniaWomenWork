import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Icon from "../components/Icon"
import Modal from "../components/Modal"
import { Formik, Form, Field } from "formik"
import * as yup from "yup"
import { api } from "../api"
import { useUser } from "../contexts/UserContext"
import { tier1Roles } from "../utils/roles"
import { toast } from "react-hot-toast"

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
  role: string
  mentor?: string
  workshops: string[] // Array of workshop names
}

interface MentorInfo {
  _id: string
  first_name: string
  last_name: string
  email: string
}

const MenteeInformation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const menteeId = location.state?.menteeId
  const [mentee, setMentee] = useState<MenteeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModal, setIsModal] = useState(false)
  const { user } = useUser()
  const [availableWorkshops, setAvailableWorkshops] = useState([])
  const [assignedWorkshops, setAssignedWorkshops] = useState<Workshop[]>([])
  const [mentors, setMentors] = useState<MentorInfo[]>([])
  const [isAssignMentorModal, setIsAssignMentorModal] = useState(false)

  useEffect(() => {
    if (!menteeId) {
      setError("Mentee ID is missing.")
      setLoading(false)
      return
    }

    const fetchMenteeData = async () => {
      try {
        // Fetch mentee details
        const menteeResponse = await api.get(
          `/api/mentee/get-mentee/${menteeId}`
        )
        setMentee(menteeResponse.data)

        // Fetch workshops assigned to this mentee
        const workshopsResponse = await api.get(
          `/api/mentee/${menteeId}/workshops`
        )
        setAssignedWorkshops(workshopsResponse.data)

        console.log("Mentee data:", menteeResponse.data)
        console.log("Assigned workshops:", workshopsResponse.data)
      } catch (err) {
        setError("Failed to load mentee details.")
        console.error("Error fetching mentee data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenteeData()
  }, [menteeId])

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await api.get("/api/workshop/get-workshops")
        setAvailableWorkshops(response.data)
      } catch (err) {
        console.error("Error fetching workshops:", err)
      }
    }
    fetchWorkshops()
  }, [])

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
  }, [menteeId])

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
      if (!menteeId) {
        throw new Error("Mentee ID is missing")
      }

      console.log(
        "Assigning workshop:",
        values.courseName,
        "to mentee:",
        menteeId
      )

      const payload = {
        workshopId: values.courseName,
      }

      console.log("Sending payload:", payload)

      const response = await api.put(
        `/api/mentee/${menteeId}/add-workshop`,
        payload
      )

      console.log("Assignment response:", response)

      if (response.status === 200) {
        toast.success("Workshop assigned successfully!")
        const updatedMentee = await api.get(
          `/api/mentee/get-mentee/${menteeId}`
        )
        setMentee(updatedMentee.data)
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
    console.log("Mentor values:", values)
  }

  // Compute initials for the mentee's avatar
  const getInitials = () => {
    if (!mentee) return ""
    return (
      mentee.first_name.charAt(0).toUpperCase() +
      mentee.last_name.charAt(0).toUpperCase()
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <>
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

          {/* Column 1: Mentee Information Block */}
          <div className="col-lg-4 mb-4">
            <div className="Block">
              <div className="Block-header">Mentee Information</div>
              <div className="Block-subtitle">Mentee Details</div>
              <div className="Block-content">
                <div className="Profile-avatar">
                  <div className="Profile-initials">{getInitials()}</div>
                </div>
                <div className="Profile-field">
                  <div className="Profile-field-label">Name:</div>
                  <div>
                    {mentee?.first_name} {mentee?.last_name}
                  </div>
                </div>
                <div className="Profile-field">
                  <div className="Profile-field-label">Role:</div>
                  <div>{mentee?.role}</div>
                </div>
                <div className="Profile-field">
                  <div className="Profile-field-label">Email:</div>
                  <div>{mentee?.email}</div>
                </div>
                <div className="Profile-field">
                  {mentee?.mentor ? (
                    <>
                      <div className="Profile-field-label">Mentor:</div>
                      <div>{mentee?.mentor}</div>
                    </>
                  ) : (
                    <div
                      className="Button Button-color--blue-1000 Width--100"
                      onClick={() => setIsAssignMentorModal(true)}
                    >
                      Assign Mentor
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Mentee Courses */}
          <div className="col-lg-4 mb-4">
            <div className="Block">
              <div className="Block-header">Mentee Courses</div>
              <div className="Block-subtitle">
                Courses assigned to {mentee?.first_name}
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
                <p>No courses assigned.</p>
              )}
              {(user?.role === "staff" || user?.role === "mentor") && (
                <button
                  className="Button Button-color--blue-1000 Width--100"
                  onClick={() => setIsModal(true)}
                >
                  Assign New Course
                </button>
              )}
            </div>
          </div>

          {/* Column 3: Upcoming Meetings */}
          <div className="col-lg-4 mb-4">
            <div className="Block">
              <div className="Block-header">Upcoming Meetings</div>
              <div className="Block-subtitle">
                Your meetings with {mentee?.first_name}
              </div>
              {/* Example static meeting item */}
              <div className="d-flex align-items-center mb-3">
                <div className="me-3 text-center" style={{ width: "40px" }}>
                  <div className="text-muted">Wed</div>
                  <div style={{ fontSize: "1.5rem", color: "#343a40" }}>25</div>
                </div>
                <div>
                  <div>Mock Interview Session</div>
                  <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Practice your interview skills with a professional.
                  </div>
                </div>
              </div>
              <button
                className="Button Button-color--blue-1000 Width--100"
                onClick={() => navigate("/create-meeting")}
              >
                Add New Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
      {isAssignMentorModal && (
        <Modal
          header={`Assign a volunteer for ${mentee?.first_name} ${mentee?.last_name}`}
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
