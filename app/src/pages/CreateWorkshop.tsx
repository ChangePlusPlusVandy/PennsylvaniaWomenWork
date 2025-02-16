import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { api } from "../api";
import Modal from "../components/Modal";
import AsyncSubmit from "../components/AsyncSubmit";

const initialValues = {
  name: "",
  description: "",
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
});

const CreateWorkshop = () => {
  // Handle form submission
  const [isModal, setIsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileTitles, setFileTitles] = useState<string[]>([]);
  const [fileAdded, setFileAdded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [fileDetails, setFileDetails] = useState<
    { title: string; desc: string; s3id: string }[]
  >([])

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any,
  ) => {
    setSubmitting(true);
    try {
      await Promise.all(
        selectedFiles.map(async (fileData) => {
          // Get pre-signed URL for the file
          console.log("File data:", fileData.file.name, fileData.file.type);
          const response = await api.get(
            `/workshop/generate-presigned-url?fileName=${fileData.file.name}`,
          );

          const { url, objectKey } = response.data;

          const uploadResponse = await fetch(url, {
            method: "PUT",
            body: fileData.file,
            headers: { "Content-Type": fileData.file.type },
          });
          console.log("Upload response:", uploadResponse);
        }),
      );
      // Create the workshop:
      const payload = {
        name: values.name,
        description: values.description,
      }
      // const { data: workshop } = await api.post("/api/create-workshop", payload);
      const { data: workshop } = await api.post(
        "/api/workshop/create-workshop",
        payload
      )

      // Add associated files (with placeholder s3id for now)
      if (fileDetails.length > 0) {
        for (const file of fileDetails) {
          await api.post("/api/resource/create-resource", {
            name: file.title,
            description: file.desc,
            s3id: file.s3id, // Placeholder
            workshopIDs: [workshop._id], // Link resource to this workshop
          })
        }
      }
      alert("Workshop created successfully!")
      resetForm()
      setFileDetails([]) // Clear file details
      setSelectedFiles([]);
      setFileAdded(false)
    } catch (error) {
      console.error("Error creating workshop:", error);
      alert("Failed to create workshop. Please try again.");
    } finally {
      setSubmitting(false);
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
  });

  const handleFileSumbit = async (
    values: any,
    { resetForm, setFieldValue }: any,
  ) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { title, desc, file } = values;
      if (!file) {
        setErrorMessage("No file selected.");
        setIsLoading(false);
        return;
      }

      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        { title, description: desc, file },
      ]);

      // Add file details with a placeholder s3id to the list
      const newFile = {
        title: title,
        desc: desc,
        s3id: "placeholder-s3-id", // TODO: change
      }
      setFileDetails((prevDetails) => [...prevDetails, newFile])
      setFileAdded(true)
      resetForm()
    } catch (error) {
      console.error("Error adding file:", error)
      setErrorMessage("Failed to add file. Please try again.")
    } finally {
      setIsLoading(false);
    }
  };

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
              onSubmit={handleFileSubmit}
            >
              {({ setFieldValue, errors, touched, isSubmitting }) => (
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
                          const file = event.currentTarget.files[0];
                          setFieldValue("file", file);
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

      <div className="Create-block">
        <div className="Create-header">Create Workshop</div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="Margin-bottom--30">
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
              </div>
              <div className="Margin-bottom--20">
                <div className="Form-group">
                  <label htmlFor="description">Workshop Description:</label>
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
                    "Create Workshop"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
export default CreateWorkshop
