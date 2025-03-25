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

interface MenteeInfo {
  _id: string // Mentee's unique ID (MongoDB ObjectID or Auth0 ID)
  first_name: string
  last_name: string
  email: string
  role: string // e.g., "mentee"
  mentor?: string // Optional mentor ID assigned to mentee
  workshops: string[] // List of workshop/course names
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

  useEffect(() => {
    if (!menteeId) {
      setError("Mentee ID is missing.")
      setLoading(false)
      return
    }

    const fetchMentee = async () => {
      try {
        console.log("Fetching mentee data for ID:", menteeId)
        const response = await api.get(`/api/mentee/get-mentee/${menteeId}`)
        setMentee(response.data)
        console.log("Fetched mentee data:", response.data)
      } catch (err) {
        setError("Failed to load mentee details.")
      } finally {
        setLoading(false)
      }
    }

    fetchMentee()
  }, [menteeId])

  const initialValues = {
    courseName: "",
    startDate: "",
    description: "",
  }

  const validationSchema = yup.object({
    courseName: yup.string().required("Course name is required"),
    startDate: yup.date().required("Start date is required"),
    description: yup.string().required("Course description is required"),
  })

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any
  ) => {
    try {
      console.log("Assign course values:", values)
      // Here you would call your API to assign the course
      setIsModal(false)
    } catch (error) {
      console.error("Error assigning course:", error)
    }
    setSubmitting(false)
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
              {mentee?.workshops && mentee.workshops.length > 0 ? (
                <ul className="list-unstyled">
                  {mentee.workshops.map((course, index) => (
                    <li key={index} className="mb-2">
                      <span className="me-2">&#8226;</span> {course}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No courses assigned.</p>
              )}
              {user && tier1Roles.includes(user.role) && (
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
                  <div className="mb-3">
                    <label htmlFor="courseName" className="form-label">
                      Course Name
                    </label>
                    <Field
                      className="form-control"
                      type="text"
                      id="courseName"
                      name="courseName"
                      placeholder="Enter course name"
                    />
                    {errors.courseName && touched.courseName && (
                      <div className="text-danger">{errors.courseName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <Field
                      className="form-control"
                      type="date"
                      id="startDate"
                      name="startDate"
                    />
                    {errors.startDate && touched.startDate && (
                      <div className="text-danger">{errors.startDate}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <Field
                      className="form-control"
                      as="textarea"
                      id="description"
                      name="description"
                      rows="3"
                      placeholder="Enter course description"
                    />
                    {errors.description && touched.description && (
                      <div className="text-danger">{errors.description}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-teal w-100"
                    disabled={isSubmitting}
                  >
                    Assign Course
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
