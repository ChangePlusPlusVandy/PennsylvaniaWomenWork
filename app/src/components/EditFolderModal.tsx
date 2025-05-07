import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: {
    name: string;
    description: string;
    role: string;
    tags: string[];
  };
  allTags: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  tags: Yup.array().of(Yup.string()),
});

const roles = [
  { id: "mentee", label: "Participant" },
  { id: "mentor", label: "Volunteer" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
];

const EditFolderModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  allTags,
}: EditFolderModalProps) => {
  // State to manage all possible tags (including newly created ones)
  const [allPossibleTags, setAllPossibleTags] = useState<string[]>(
    allTags || [],
  );
  // State to track current form values for debugging
  const [currentTags, setCurrentTags] = useState<string[]>(
    initialValues.tags || [],
  );

  // Initialize allPossibleTags when allTags changes
  useEffect(() => {
    setAllPossibleTags(allTags || []);
    console.log("All possible tags:", allTags);
    console.log("Initial values:", initialValues);
  }, [allTags, initialValues]);

  // Log current tags whenever they change
  useEffect(() => {
    console.log("Current tags in form:", currentTags);
  }, [currentTags]);

  return (
    <Modal
      header="Edit Folder"
      subheader="Update details of this folder"
      action={onClose}
      body={
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {({
            setFieldValue,
            values,
            errors,
            touched,
            dirty,
            isSubmitting,
          }) => (
            <Form>
              <div className="Form-group">
                <label htmlFor="name">Folder Name:</label>
                <Field
                  type="text"
                  name="name"
                  className="Form-input-box"
                  placeholder="Enter folder name"
                />
                {errors.name && touched.name && (
                  <div className="Form-error">{errors.name}</div>
                )}
              </div>

              <div className="Form-group">
                <label htmlFor="description">Description:</label>
                <Field
                  as="textarea"
                  name="description"
                  className="Form-input-box text-area"
                  placeholder="Enter event description"
                  rows={4}
                />
                {errors.description && touched.description && (
                  <div className="Form-error">{errors.description}</div>
                )}
              </div>

              <div className="Form-group">
                <label>Audience:</label>
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
                </div>
                {errors.role && touched.role && (
                  <div className="Form-error">{errors.role}</div>
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
                  value={(values.tags || []).map((tag) => {
                    console.log("Mapping tag to option:", tag);
                    return { label: tag, value: tag };
                  })}
                  onChange={(selectedOptions: any) => {
                    console.log("Selected options:", selectedOptions);
                    const newTags = selectedOptions
                      ? selectedOptions.map((opt: any) => opt.value)
                      : [];
                    setFieldValue("tags", newTags);
                    setCurrentTags(newTags); // Update our state for debugging
                  }}
                  onCreateOption={(inputValue: string) => {
                    const trimmed = inputValue.trim();
                    if (!trimmed) return;
                    if (!allPossibleTags.includes(trimmed)) {
                      setAllPossibleTags((prev) => [...prev, trimmed]);
                    }
                    const newTags = [...(values.tags || []), trimmed];
                    setFieldValue("tags", newTags);
                    setCurrentTags(newTags); // Update our state for debugging
                  }}
                  placeholder="Edit tags..."
                  isClearable
                  isSearchable
                  className="Margin-bottom--10"
                  styles={{
                    control: (base: any) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                    }),
                    menu: (base: any) => ({
                      ...base,
                      zIndex: 9999, // Very high z-index
                    }),
                    menuPortal: (base: any) => ({
                      ...base,
                      zIndex: 9999, // Very high z-index for the portal
                    }),
                  }}
                  formatCreateLabel={(inputValue: string) =>
                    `Create new tag: "${inputValue}"`
                  }
                  createOptionPosition="first"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>

              <button
                type="submit"
                className="Button Button-color--blue-1000 Width--100"
                disabled={!dirty || isSubmitting}
              >
                Save Changes
              </button>
            </Form>
          )}
        </Formik>
      }
    />
  );
};

export default EditFolderModal;
