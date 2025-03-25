import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { toast } from "react-hot-toast"
import { ReactComponent as SendIcon } from "../assets/send.svg"
import Navbar from "../components/Navbar"
import AsyncSubmit from "../components/AsyncSubmit"
import { api } from "../api"

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  verifyEmail: "",
  role: "",
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  verifyEmail: Yup.string()
    .oneOf([Yup.ref("email")], "Emails must match")
    .required("Please verify email"),
  role: Yup.string().required("Role is required"),
})

const roles = [
  { id: "mentee", label: "Mentee" },
  { id: "mentor", label: "Mentor" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
]

const SampleMenteeInvite = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    console.log("Submitting email invite", values)
    setIsLoading(true)
    try {
      const response = await api.post("/user/send-email", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: "mentee",
      })

      if (response.status === 200) {
        toast.success("Invite sent successfully!", {
          duration: 2000,
          position: "top-center",
        })
        resetForm()
      } else {
        throw new Error("Failed to send invite")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      toast.error("Failed to send invite", {
        duration: 2000,
        position: "top-center",
      })
    } finally {
      setIsLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="FormWidget">
        <div className="FormWidget-body Block">
          <div className="Block-header">Send a Network Invite</div>
          <div className="Block-subtitle">
            Invite a mentee to join your network
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form>
                <div className="Form-group">
                  <label>First Name:</label>
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    className="Form-input-box"
                    autoComplete="given-name"
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="Form-error">{errors.firstName}</div>
                  )}
                </div>
                <div className="Form-group">
                  <label>Last Name:</label>
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    className="Form-input-box"
                    autoComplete="family-name"
                  />
                  {errors.lastName && touched.lastName && (
                    <div className="Form-error">{errors.lastName}</div>
                  )}
                </div>
                <div className="Form-group">
                  <label>Email Address:</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className="Form-input-box"
                    autoComplete="email"
                  />
                  {errors.email && touched.email && (
                    <div className="Form-error">{errors.email}</div>
                  )}
                </div>
                <div className="Form-group">
                  <label>Verify Email Address:</label>
                  <Field
                    type="email"
                    name="verifyEmail"
                    placeholder="Verify email address"
                    className="Form-input-box"
                    autoComplete="email"
                  />
                  {errors.verifyEmail && touched.verifyEmail && (
                    <div className="Form-error">{errors.verifyEmail}</div>
                  )}
                </div>
                <div className="Form-group">
                  <label className="Form-label">
                    Select a Role to Assign to This User:
                  </label>
                  <div className="Role-tags">
                    {roles.map((role) => (
                      <div key={role.id} className="Role-tag-item">
                        <input
                          type="radio"
                          id={`role-${role.id}`}
                          name="role"
                          className="Role-tag-input"
                          checked={values.role === role.id}
                          onChange={() => setFieldValue("role", role.id)}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="Role-tag-label"
                        >
                          {role.label}
                        </label>
                      </div>
                    ))}
                    {errors.role && touched.role && (
                      <div className="Form-error">{errors.role}</div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="Button Button-color--blue-1000 Width--100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <AsyncSubmit loading={isLoading} />
                  ) : (
                    <div className="Flex-row Align-items--center Justify-content--center">
                      <span>Send Invite</span>
                    </div>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default SampleMenteeInvite
