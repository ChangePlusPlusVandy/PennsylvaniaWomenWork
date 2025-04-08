import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import pdf from "../assets/pdf.jpg";
import docx from "../assets/docx.png";
import video from "../assets/video.png";
import Icon from "../components/Icon";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../contexts/UserContext";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AsyncSubmit from "../components/AsyncSubmit";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import { toast } from "react-hot-toast";
import ConfirmActionModal from "../components/ConfirmActionModal";

const animatedComponents = makeAnimated();

const getIconForFile = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return pdf;
    case "doc":
    case "docx":
      return docx;
    case "mp4":
    case "mov":
    case "avi":
      return video;
    default:
      return docx;
  }
};

interface Workshop {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  createdAt: string;
  mentor: string;
  mentee: string;
}

const WorkshopInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workshopId = location.state?.workshopId;
  const [resources, setResources] = useState<any[]>([]);
  const [workshop, setWorkshop] = React.useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [isModal, setIsModal] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [fileAdded, setFileAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // get workshop information by id
  const getWorkshop = async () => {
    try {
      if (!workshopId) {
        console.error("No workshop ID provided");
        return;
      }

      const response = await api.get(`/api/workshop/${workshopId}`);
      setWorkshop(response.data);
    } catch (error) {
      console.error("Error fetching folder:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkshop();
  }, [workshopId]);

  useEffect(() => {
    // call endpoint to get all resources for a workshop
    const fetchResources = async () => {
      try {
        const { data: resourceList } = await api.get(
          `/api/resource/get-resource-by-workshop/${workshopId}`,
        );

        if (!resourceList || resourceList.length === 0) {
          setResources([]);
          setError("No resources found.");
          return;
        }

        const resourcesWithURL = await Promise.all(
          resourceList.map(async (res: any) => {
            const { data } = await api.get(`/api/resource/getURL/${res.s3id}`);
            return { ...res, url: data.signedUrl };
          }),
        );
        setResources(resourcesWithURL);
      } catch (error) {
        setError("Error fetching resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workshop) {
    return <div>Folder not found</div>;
  }
  const deleteWorkshop = async () => {
    try {
      // TODO: Add API call to delete workshop
      await api.delete(`/api/workshop/delete-workshop/${workshop?._id}`);
      console.log("Deleting workshop:", workshop?._id);
      setShowDeleteModal(false);
      toast.success("Workshop deleted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting workshop:", error);
    }
  };

  const fileUploadInitialValues = {
    title: "",
    desc: "",
    file: null, // This will not be used until s3 integration
  };

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

      const response = await api.get(
        `/api/workshop/generate-presigned-url/${encodeURIComponent(file.name)}`,
      );

      const { url, objectKey } = response.data;

      // Add file details with a placeholder s3id to the list
      const newFile = {
        title: title,
        desc: desc,
        url: url, // TODO: change
        s3id: objectKey, // TODO: change
        file: file,
        tags: selectedTags,
      };

      const uploadResponse = await fetch(newFile.url, {
        method: "PUT",
        body: newFile.file,
        headers: { "Content-Type": newFile.file.type },
      });
      console.log("Upload response:", uploadResponse);
      await api.post("/api/resource/create-resource", {
        name: newFile.title,
        description: newFile.desc,
        s3id: newFile.s3id, // Placeholder
        workshopIDs: [workshopId], // Link resource to this workshop
        tags: newFile.tags,
      });

      const { data } = await api.get(`/api/resource/getURL/${newFile.s3id}`);

      setResources((prev) => [
        ...prev,
        {
          name: newFile.title,
          description: newFile.desc,
          s3id: newFile.s3id,
          tags: newFile.tags,
          url: data.signedUrl,
        },
      ]);

      resetForm();
      setIsModal(false);
    } catch (error) {
      console.error("Error adding file:", error);
      setErrorMessage("Failed to add file. Please try again.");
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
              onSubmit={handleFileSumbit}
            >
              {({ setFieldValue, errors, touched, isSubmitting }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="tags">Tags (select or create new)</label>
                    <CreatableSelect
                      components={animatedComponents}
                      isMulti
                      options={availableTags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                      value={selectedTags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                      onChange={(selectedOptions: any) =>
                        setSelectedTags(
                          selectedOptions.map((opt: any) => opt.value),
                        )
                      }
                      onCreateOption={(inputValue: any) => {
                        const trimmed = inputValue.trim();
                        if (!trimmed) return;
                        if (!availableTags.includes(trimmed)) {
                          setAvailableTags((prev) => [...prev, trimmed]);
                        }
                        if (!selectedTags.includes(trimmed)) {
                          setSelectedTags((prev) => [...prev, trimmed]);
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
      {/* <div className="WorkshopInfo"> */}
      <div className="container mt-4">
        <div className="row">
          <div
            className="col-lg-12 mb-4"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>
          <div className="Block ">
            <div className="Block-header Flex-row">
              {workshop?.name}
              <div className="Flex-row Margin-left--auto">
                <div style={{ gap: "10px" }}>
                  {user?.role === "staff" && (
                    <div
                      // className="Button Button-color--red-1000"
                      className="Text-color--gray-1000 Text-colorHover--red-1000 Margin-right--10"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Icon glyph="trash" />
                    </div>
                  )}
                </div>
                {(user?.role === "mentor" || user?.role === "staff") && (
                  <div
                    className="Button Button-color--blue-1000 Margin-left--auto"
                    onClick={() => setIsModal(true)}
                  >
                    Add New Files
                  </div>
                )}
              </div>
            </div>
            {showDeleteModal && (
              <ConfirmActionModal
                isOpen={showDeleteModal}
                title="Delete Folder"
                message="Are you sure you want to delete this folder?"
                confirmLabel="Delete"
                onConfirm={deleteWorkshop}
                onCancel={() => setShowDeleteModal(false)}
                isDanger
              />
            )}
            <div className="Block-subtitle">{workshop?.description}</div>

            <div className="row gx-3 gy-3">
              {loading ? (
                <p>Loading resources...</p>
              ) : error ? (
                <p style={{ color: "red", marginLeft: "15px" }}>{error}</p>
              ) : (
                resources.map((file) => (
                  <div key={file._id} className="col-lg-2">
                    <div
                      className="Card"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      {" "}
                      {/* Ensure Card is inside col-lg-2 */}
                      <div className="WorkshopInfo-image">
                        <img src={getIconForFile(file.s3id)} alt={file.type} />
                      </div>
                      <div className="WorkshopInfo-title">{file.name}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkshopInformation;
