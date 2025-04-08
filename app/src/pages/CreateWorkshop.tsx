import React, { useEffect, useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import Navbar from "../components/Navbar"
import { api } from "../api"
import Modal from "../components/Modal"
import AsyncSubmit from "../components/AsyncSubmit"
import { useNavigate } from "react-router-dom"
import { url } from "inspector"
import { toast } from "react-hot-toast"
import CreatableSelect from "react-select/creatable"
import makeAnimated from "react-select/animated"

const animatedComponents = makeAnimated()

interface FormValues {
  name: string
  description: string
  imageUpload: File | null
  role: string
}

const initialValues: FormValues = {
  name: "",
  description: "",
  imageUpload: null,
  role: "",
}

const roles = [
  { id: "mentee", label: "Participant" },
  { id: "mentor", label: "Volunteer" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
]

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),

  imageUpload: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true

      const maxSize = 2 * 1024 * 1024 // 2 MB
      return (value as File).size <= maxSize
    })
    .test(
      "fileType",
      "Unsupported file format. Only JPEG and PNG are allowed.",
      (value) => {
        if (!value) return true

        const supportedFormats = ["image/jpeg", "image/png"]
        return supportedFormats.includes((value as File).type)
      }
    ),
})

const CreateWorkshop = () => {
  // Handle form submission
  const [isModal, setIsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fileTitles, setFileTitles] = useState<string[]>([])
  const [fileAdded, setFileAdded] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])
  const [fileDetails, setFileDetails] = useState<
    {
      title: string
      desc: string
      url: string
      s3id: string
      file: any
      tags: string[]
    }[]
  >([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [possibleTags, setPossibleTags] = useState<string[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/api/board/get-tags")
        setPossibleTags(response.data)
      } catch (error) {
        console.error("Error fetching tags:", error)
      }
    }

    fetchTags()
  }, [])

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true)
    try {
      let coverImageS3id = null

      if (values.imageUpload) {
        // Get presigned URL for the cover image
        const coverImageResponse = await api.get(
          `/api/workshop/generate-presigned-url/${encodeURIComponent(values.imageUpload.name)}`
        )

        const { url: coverImageUrl, objectKey: coverImageObjectKey } =
          coverImageResponse.data

        // Upload the cover image to S3
        await fetch(coverImageUrl, {
          method: "PUT",
          body: values.imageUpload,
          headers: { "Content-Type": values.imageUpload.type },
        })

        coverImageS3id = coverImageObjectKey
      }

      const payload = {
        name: values.name,
        description: values.description,
        coverImageS3id,
      }
      // const { data: workshop } = await api.post("/api/create-workshop", payload);
      const { data: workshop, status } = await api.post(
        "/api/workshop/create-workshop",
        payload
      )

      if (status === 201) {
        toast.success("Workshop created successfully!")
      }

      // Add associated files (with placeholder s3id for now)
      if (fileDetails.length > 0) {
        for (const file of fileDetails) {
          const uploadResponse = await fetch(file.url, {
            method: "PUT",
            body: file.file,
            headers: { "Content-Type": file.file.type },
          })
          await api.post("/api/resource/create-resource", {
            name: file.title,
            description: file.desc,
            s3id: file.s3id, // Placeholder
            workshopIDs: [workshop.workshop._id], // Link resource to this workshop
            tags: file.tags,
          })
        }
      }
      //alert("Workshop created successfully!");
      resetForm()
      setFileDetails([]) // Clear file details
      setSelectedFiles([])
      setFileAdded(false)
      // close modal
      setIsModal(false)
      //navigate("/workshops");
    } catch (error) {
      console.error("Error creating workshop:", error)
      // alert("Failed to create workshop. Please try again.");
      toast.error("Failed to create folder. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const fileUploadInitialValues = {
    title: "",
    desc: "",
    file: null, // This will not be used until s3 integration
  }

  const fileValidation = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    desc: Yup.string().required("Description is required"),
    file: Yup.mixed().required("Please select a file"),
  })

  const handleFileSumbit = async (
    values: any,
    { resetForm, setFieldValue }: any
  ) => {
    setIsLoading(true)
    setErrorMessage("")
    try {
      const { title, desc, file } = values
      if (!file) {
        setErrorMessage("No file selected.")
        setIsLoading(false)
        return
      }

      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        { title, description: desc, file },
      ])

      const response = await api.get(
        `/api/workshop/generate-presigned-url/${encodeURIComponent(file.name)}`
      )

      const { url, objectKey } = response.data

      // Add file details with a placeholder s3id to the list
      const newFile = {
        title: title,
        desc: desc,
        url: url, // TODO: change
        s3id: objectKey, // TODO: change
        file: file,
        tags: selectedTags,
      }
      setFileDetails((prevDetails) => [...prevDetails, newFile])
      setFileAdded(true)
      resetForm()
    } catch (error) {
      console.error("Error adding file:", error)
      setErrorMessage("Failed to add file. Please try again.")
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
              {({ setFieldValue, errors, touched, isSubmitting }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="tags">Tags (select or create new)</label>
                    <CreatableSelect
                      components={animatedComponents}
                      isMulti
                      options={possibleTags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                      value={selectedTags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                      onChange={(selectedOptions: any) =>
                        setSelectedTags(
                          selectedOptions.map((opt: any) => opt.value)
                        )
                      }
                      onCreateOption={(inputValue: any) => {
                        const trimmed = inputValue.trim()
                        if (!trimmed) return
                        if (!possibleTags.includes(trimmed)) {
                          setPossibleTags((prev) => [...prev, trimmed])
                        }
                        if (!selectedTags.includes(trimmed)) {
                          setSelectedTags((prev) => [...prev, trimmed])
                        }
                      }}
                      placeholder="Select or type to create a tag..."
                      isClearable={false}
                      isSearchable
                      className="Margin-bottom--10"
                      styles={{
                        control: (base: any) => ({
                          ...base,
                          borderColor: "#ccc",
                          boxShadow: "none",
                        }),
                      }}
                      formatCreateLabel={(inputValue: any) =>
                        `Create new tag: "${inputValue}"`
                      }
                      createOptionPosition="first"
                    />
                  </div>

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
                    <input
                      className="Form-input-box"
                      type="file"
                      id="file"
                      name="file"
                      onChange={(event) => {
                        if (event.currentTarget.files) {
                          const file = event.currentTarget.files[0]
                          setFieldValue("file", file)
                        }
                      }}
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

                  {fileAdded && (
                    <div className="Form-success">File added successfully!</div>
                  )}
                </Form>
              )}
            </Formik>
          }
        />
      )}
      <Navbar />

      <div className="FormWidget">
        <div className="FormWidget-body Block">
          <div className="Block-header">Create Folder</div>
          <div className="Block-subtitle">Add a new workshop</div>
          <div className="Block-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="name">Workshop Name:</label>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="Form-input-box"
                    />
                    {errors.name && touched.name && (
                      <div className="Form-error">{errors.name}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="description">Folder Description:</label>
                    <Field
                      type="text"
                      name="description"
                      placeholder="Description"
                      className="Form-input-box"
                    />
                    {errors.description && touched.description && (
                      <div className="Form-error">{errors.description}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="imageUpload">
                      Workshop cover Image (optional):
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      name="imageUpload"
                      className="Form-input-box"
                      accept="image/*"
                      onChange={(event) => {
                        if (event.currentTarget.files) {
                          const file = event.currentTarget.files[0]
                          console.log("Selected file:", file)
                          setFieldValue("imageUpload", file)
                        }
                      }}
                    />
                    {errors.imageUpload && touched.imageUpload && (
                      <div className="Form-error">{errors.imageUpload}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label className="Form-label">
                      Select a Group to Give Access to This File:
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
                  {fileDetails.length > 0 && (
                    <div>
                      <h4>Uploaded Files:</h4>
                      <ul>
                        {fileDetails.map((file, index) => (
                          <li key={index}>{file.title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="Flex-row Justify-content--center Margin-top--30">
                    <button
                      type="button"
                      className="Button Button-color--blue-1000 Width--50 Margin-right--10"
                      onClick={() => setIsModal(true)}
                    >
                      Add Files
                    </button>
                    <button
                      type="submit"
                      className="Button Button-color--blue-1000 Width--50 Button--hollow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <AsyncSubmit loading={isSubmitting} />
                      ) : (
                        "Create Folder"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}
export default CreateWorkshop
