import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { api } from "../api";
import Modal from "../components/Modal";
import AsyncSubmit from "../components/AsyncSubmit";
import { useNavigate } from "react-router-dom";
import { url } from "inspector";
import { toast } from "react-hot-toast";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import AddFileModal from "../components/AddFileModal";

const animatedComponents = makeAnimated();

interface FormValues {
  name: string;
  description: string;
  imageUpload: File | null;
  role: string;
  tags: string[];
}

interface ResourcePayload {
  name: string;
  description: string;
  s3id: string;
  tags: string[];
  boardFileId?: string;
  workshopIDs?: string[];
}

const initialValues: FormValues = {
  name: "",
  description: "",
  imageUpload: null,
  role: "",
  tags: [],
};

const roles = [
  { id: "mentee", label: "Participant" },
  { id: "mentor", label: "Volunteer" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
];

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  role: Yup.string().required("Please select an audience"),
  imageUpload: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true;

      const maxSize = 100 * 1024 * 1024; // 100 MB
      return (value as File).size <= maxSize;
    })
    .test(
      "fileType",
      "Unsupported file format. Only JPEG and PNG are allowed.",
      (value) => {
        if (!value) return true;

        const supportedFormats = ["image/jpeg", "image/png"];
        return supportedFormats.includes((value as File).type);
      },
    ),
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
    {
      title: string;
      desc: string;
      url: string;
      s3id: string;
      file: any;
      tags: string[];
    }[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [possibleTags, setPossibleTags] = useState<string[]>([]);
  const [allPossibleTags, setAllPossibleTags] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const [workshopResponse, boardResponse] = await Promise.all([
          api.get("/api/workshop/get-tags"),
          api.get("/api/board/get-tags"),
        ]);

        const workshopTags = workshopResponse.data;
        const boardTags = boardResponse.data;

        // Combine and deduplicate tags
        const allTags = Array.from(new Set([...workshopTags, ...boardTags]));
        setAllPossibleTags(allTags);
        setPossibleTags(allTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchAllTags();
  }, []);

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any,
  ) => {
    setSubmitting(true);
    try {
      let coverImageS3id = null;
      let createdId = null;

      if (fileDetails.length === 0) {
        toast.error("Please upload at least one file.");
        setSubmitting(false);
        return;
      }

      if (values.imageUpload) {
        const coverImageResponse = await api.get(
          `/api/workshop/generate-presigned-url/${encodeURIComponent(values.imageUpload.name)}`,
        );

        const { url: coverImageUrl, objectKey: coverImageObjectKey } =
          coverImageResponse.data;

        await fetch(coverImageUrl, {
          method: "PUT",
          body: values.imageUpload,
          headers: { "Content-Type": values.imageUpload.type },
        });

        coverImageS3id = coverImageObjectKey;
      }

      // Create either board file or workshop based on role
      if (values.role === "board") {
        console.log("Board file payload:", {
          name: values.name,
          description: values.description,
          coverImageS3id: coverImageS3id || `placeholder-${Date.now()}`, // Provide a placeholder if no image
          tags: values.tags,
          role: values.role,
        });
        try {
          const { data, status } = await api.post(
            "/api/board/create-board-file",
            {
              name: values.name,
              description: values.description,
              coverImageS3id: coverImageS3id || `placeholder-${Date.now()}`, // Provide a placeholder if no image
              tags: values.tags,
              role: values.role,
            },
          );

          if (status === 201) {
            toast.success("Board file created successfully!");
            createdId = data.boardFile._id;
          }
        } catch (error) {
          console.error("Error creating board file:", error);
          throw error;
        }
      } else {
        const payload = {
          name: values.name,
          description: values.description,
          coverImageS3id,
          tags: values.tags,
          role: values.role,
        };

        console.log("Workshop payload:", payload);

        const { data: workshopData, status } = await api.post(
          "/api/workshop/create-workshop",
          payload,
        );

        if (status === 201) {
          toast.success("Folder created successfully!");
          createdId = workshopData.workshop._id;
        }
      }

      // Upload associated files
      if (fileDetails.length > 0 && createdId) {
        for (const file of fileDetails) {
          await fetch(file.url, {
            method: "PUT",
            body: file.file,
            headers: { "Content-Type": file.file.type },
          });

          const resourcePayload: ResourcePayload = {
            name: file.title,
            description: file.desc,
            s3id: file.s3id,
            tags: file.tags,
            ...(values.role === "board"
              ? { boardFileID: createdId }
              : { workshopIDs: [createdId] }),
          };
          try {
            await api.post("/api/resource/create-resource", resourcePayload);
          } catch (error) {
            console.error("Error creating resource:", error);
            toast.error("Failed to create resource. Please try again.");
          }
        }
      }

      resetForm();
      setFileDetails([]);
      setSelectedFiles([]);
      setFileAdded(false);
      setIsModal(false);
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder. Please try again.");
    } finally {
      setSubmitting(false);
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

      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        { title, description: desc, file },
      ]);

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
      setFileDetails((prevDetails) => [...prevDetails, newFile]);
      setFileAdded(true);
      resetForm();
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
        <AddFileModal
          isOpen={isModal}
          onClose={() => setIsModal(false)}
          onSubmit={handleFileSumbit}
          isLoading={isLoading}
          errorMessage={errorMessage}
          fileAdded={fileAdded}
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
                          const file = event.currentTarget.files[0];
                          console.log("Selected file:", file);
                          setFieldValue("imageUpload", file);
                        }
                      }}
                    />
                    {errors.imageUpload && touched.imageUpload && (
                      <div className="Form-error">{errors.imageUpload}</div>
                    )}
                  </div>
                  <div className="Form-group">
                    <label htmlFor="tags">Tags (select or create new)</label>
                    <CreatableSelect
                      components={animatedComponents}
                      isMulti
                      options={allPossibleTags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                      value={values.tags.map((tag) => ({
                        label: tag,
                        value: tag,
                      }))}
                      onChange={(selectedOptions: any) =>
                        setFieldValue(
                          "tags",
                          selectedOptions
                            ? selectedOptions.map((opt: any) => opt.value)
                            : [],
                        )
                      }
                      onCreateOption={(inputValue: string) => {
                        const trimmed = inputValue.trim();
                        if (!trimmed) return;
                        if (!allPossibleTags.includes(trimmed)) {
                          setAllPossibleTags((prev) => [...prev, trimmed]);
                        }
                        setFieldValue("tags", [...values.tags, trimmed]);
                      }}
                      placeholder="Select or type to create tags..."
                      isClearable
                      isSearchable
                      className="Margin-bottom--10"
                      styles={{
                        control: (base: any) => ({
                          ...base,
                          borderColor: "#ccc",
                          boxShadow: "none",
                        }),
                      }}
                      formatCreateLabel={(inputValue: string) =>
                        `Create new tag: "${inputValue}"`
                      }
                      createOptionPosition="first"
                    />
                  </div>
                  <div className="Form-group">
                    <label className="Form-label">
                      Select group(s) to give bulk access (optional):
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
                      <div className="Filter-tags">
                        {fileDetails.map((file, index) => (
                          <div
                            key={index}
                            className="Filter-tag"
                            onClick={() =>
                              setFileDetails((prev) =>
                                prev.filter((_, i) => i !== index),
                              )
                            }
                          >
                            {file.title} ✕
                          </div>
                        ))}
                      </div>
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
  );
};
export default CreateWorkshop;
