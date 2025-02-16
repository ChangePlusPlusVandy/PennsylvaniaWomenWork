import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import Navbar from "../components/Navbar"
import { api } from "../api"
import Modal from "../components/Modal"
import AsyncSubmit from "../components/AsyncSubmit"

const initialValues = {
  name: "",
  description: "",
}

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
})

const CreateWorkshop = () => {
  // Handle form submission
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true)
    try {
      const payload = {
        name: values.name,
        description: values.description,
        s3id: "example-s3-id", // TODO: Placeholder for S3 ID until set up
      }

      await api.post("/api/create-workshop", payload)
      // api.ts deals with error responses !
    } catch (error) {
      console.error("Error creating workshop:", error)
      alert("Failed to create workshop. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const [isModal, setIsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fileTitles, setFileTitles] = useState<string[]>([])
  const [fileAdded, setFileAdded] = useState(false)
  const [success, setSuccess] = useState(false)

  const fileUploadInitialValues = {
    title: "",
    desc: "",
    file: "",
  }
  const fileValidation = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Description is required"),
    file: Yup.mixed().required("Please select a file"),
  })

  const handleFileSumbit = async (values: any, { resetForm }: any) => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const finalData = {
        title: values.title,
        desc: values.desc,
        file: values.file,
      }
      setFileTitles((prevTitles) => [...prevTitles, values.title])
      setFileAdded(true)
      console.log("Submitting data:", finalData)
      setSuccess(true)
      setErrorMessage("")
      resetForm()
    } catch (error) {
      console.error("Error submitting:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isModal && (
        <Modal
          header="Add New Files"
          subheader="Select Files to Upload"
          action={() => setIsModal(false)}
          body={
            <Formik
              initialValues={fileUploadInitialValues}
              validationSchema={fileValidation}
              onSubmit={handleFileSumbit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="title">Title</label>
                    <Field
                      className="Form-input-box"
                      type="text"
                      id="title"
                      name="title"
                    />
                    {errors.title && touched.title && (
                      <div className="Form-error">{errors.title}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="desc">Description</label>
                    <Field
                      as="textarea"
                      className="Form-input-box text-area"
                      type="text"
                      id="desc"
                      name="desc"
                      rows="4"
                    />
                    {errors.desc && touched.desc && (
                      <div className="Form-error">{errors.desc}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="file">Files</label>
                    <Field
                      className="Form-input-box"
                      type="file"
                      id="file"
                      name="file"
                    />
                    {errors.file && touched.file && (
                      <div className="Form-error">{errors.file}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="Button Margin-top--10 Button-color--teal-1000 Width--100"
                    disabled={
                      Object.keys(errors).length > 0 ||
                      !Object.keys(touched).length ||
                      isSubmitting
                    }
                    // Disable button if there are errors or no fields are touched or form is submitting
                  >
                    {isSubmitting ? (
                      <AsyncSubmit loading={isLoading} />
                    ) : (
                      "Upload Files"
                    )}
                  </button>

                  {errorMessage && (
                    <div className="Form-error">{errorMessage}</div>
                  )}

                  {success && (
                    <div className="Form-success">
                      File uploaded successfully!
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          }
        />
      )}
      <Navbar />

      <div className="Create-block">
        <div className="Create-header">Create Workshop</div>
        <div className="Margin-left--40 Margin-right--40">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="Margin-bottom--30">
                  <div className="Form-group">
                    <label className="name">Workshop Name:</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="Form-input-box"
                    />
                    {/* Display error message if name field is invalid */}
                    {errors.name && touched.name && (
                      <div className="Form-error">{errors.name}</div>
                    )}
                  </div>
                </div>

                <div className="Margin-bottom--20">
                  <div className="Form-group">
                    <label className="description">Workshop Description:</label>
                    <Field
                      type="text"
                      name="description"
                      placeholder="Description"
                      className="Form-input-box"
                    />
                    {/* Display error message if description field is invalid */}
                    {errors.description && touched.description && (
                      <div className="Form-error">{errors.description}</div>
                    )}
                  </div>
                </div>
                {fileAdded && (
                  <div>
                    <div className="Create-file-row">
                      <div className="description">Files:</div>
                    </div>
                    <ul>
                      {fileTitles.map((title, index) => (
                        <li key={index}>{title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="Flex-row Justify-content--center">
                  <div
                    className="Button Button-color--blue-1000 Width--100 Margin-right--10"
                    onClick={() => setIsModal(true)}
                  >
                    Add Files
                  </div>
                  <button
                    type="submit"
                    className="Button Button-color--blue-1000 Button--hollow Width--100 Margin-left--10"
                    disabled={isSubmitting} // Disable button while form is submitting
                  >
                    {isSubmitting ? (
                      <AsyncSubmit loading={isSubmitting} />
                    ) : (
                      "Create Workshop"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}

export default CreateWorkshop
