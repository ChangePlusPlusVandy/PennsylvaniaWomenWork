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
import { Spinner } from "react-bootstrap";
import FileCard from "../components/FileCard";
import AddFileModal from "../components/AddFileModal";
import EditFolderModal from "../components/EditFolderModal";

const animatedComponents = makeAnimated();

interface Workshop {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  createdAt: string;
  mentor: string;
  mentee: string;
  role: string;
  tags: string[];
  coverImageS3id: string;
}

const WorkshopInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workshopId = location.state?.workshopId;
  const boardFileId = location.state?.boardFileId;

  const isWorkshop = Boolean(workshopId);
  const [resources, setResources] = useState<any[]>([]);
  const [workshop, setWorkshop] = React.useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [isModal, setIsModal] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fileAdded, setFileAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // get workshop information by id
  const getFolder = async () => {
    try {
      if (!workshopId && !boardFileId) {
        console.error("No ID provided");
        return;
      }

      const response = isWorkshop
        ? await api.get(`/api/workshop/${workshopId}`)
        : await api.get(`/api/board/${boardFileId}`);
      setWorkshop(response.data);
    } catch (error) {
      console.error("Error fetching folder:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFolder();
  }, [workshopId, boardFileId]);

  useEffect(() => {
    // call endpoint to get all resources for a workshop
    const fetchResources = async () => {
      try {
        let resourceList: any[] = [];

        if (isWorkshop) {
          const res = await api.get(
            `/api/resource/get-resource-by-workshop/${workshopId}`,
          );
          resourceList = res.data;
        } else {
          const res = await api.get(
            `/api/resource/get-resource-by-board-file/${boardFileId}`,
          );
          resourceList = res.data;
        }

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
  }, [workshopId, boardFileId]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [workshopResponse, boardResponse] = await Promise.all([
          api.get("/api/workshop/get-tags"),
          api.get("/api/board/get-tags"),
        ]);

        const workshopTags = workshopResponse.data;
        const boardTags = boardResponse.data;

        // Combine and deduplicate tags
        const allTags = Array.from(new Set([...workshopTags, ...boardTags]));
        console.log("All tags:", allTags);
        setAvailableTags(allTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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

  // TODO api call to delete file
  const handleDeleteFile = async (fileId: string) => {
    const remainingFiles = resources.filter((file) => file._id !== fileId);

    if (remainingFiles.length === 0) {
      toast.error("A folder must contain at least one file.");
      return;
    }

    console.log("Deleting file with ID:", fileId);

    try {
      await api.delete(`/api/resource/delete-file/${fileId}`);
      setResources(remainingFiles);
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  // TODO api call to edit folder
  const handleEditFolder = async (values: any) => {
    try {
      if (isWorkshop) {
        await api.put(`/api/workshop/update-workshop/${workshop?._id}`, values);
        toast.success("Folder updated successfully!");
        // Refresh the workshop data
        getFolder();
        setShowEditModal(false);
      } else {
        // Handle board file update if needed
        await api.put(`/api/board/update-board-file/${workshop?._id}`, values);
        toast.success("Board file updated successfully!");
        getFolder();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error editing folder:", error);
      toast.error("Failed to edit folder. Please try again.");
    }
  };

  return (
    <>
      {isModal && (
        <AddFileModal
          isOpen={isModal}
          onClose={() => setIsModal(false)}
          onSubmit={handleFileSumbit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          fileAdded={fileAdded}
        />
      )}
      {showDeleteFileModal && fileToDelete && (
        <ConfirmActionModal
          isOpen={showDeleteFileModal}
          title="Delete File"
          message="Are you sure you want to delete this file?"
          confirmLabel="Delete"
          onConfirm={() => {
            handleDeleteFile(fileToDelete);
            setShowDeleteFileModal(false);
            setFileToDelete(null);
          }}
          onCancel={() => {
            setShowDeleteFileModal(false);
            setFileToDelete(null);
          }}
          isDanger
        />
      )}

      {showEditModal && workshop && (
        <EditFolderModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditFolder}
          initialValues={{
            name: workshop.name,
            description: workshop.description,
            role: workshop.role || "",
            tags: workshop.tags || [],
          }}
          allTags={availableTags}
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
          {!workshop ? (
            <div>Folder not found</div>
          ) : (
            <div className="Block">
              <div className="Block-header Flex-row">
                {workshop?.name}
                <div className="Flex-row Margin-left--auto">
                  <div style={{ gap: "10px" }}>
                    {user?.role === "staff" && (
                      <div className="Flex-row">
                        <div
                          className="Text-color--gray-1000 Text-colorHover--red-1000 Margin-right--10"
                          onClick={() => setShowDeleteModal(true)}
                        >
                          <Icon glyph="trash" />
                        </div>
                        <div
                          className="Text-color--gray-1000 Text-colorHover--green-1000 Margin-right--10"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Icon glyph="edit" />
                        </div>
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
                  <Spinner></Spinner>
                ) : resources.length === 0 ? (
                  <p>No Files in this Folder</p>
                ) : (
                  resources.map((file) => (
                    <div
                      key={file._id}
                      className="col-lg-3 col-md-3 col-sm-4 col-6"
                    >
                      <FileCard
                        file={file}
                        onDelete={() => {
                          setFileToDelete(file._id);
                          setShowDeleteFileModal(true);
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkshopInformation;
