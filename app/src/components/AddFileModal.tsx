import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import AsyncSubmit from "./AsyncSubmit";
import { toast } from "react-hot-toast";

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any, helpers: any) => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
  fileAdded: boolean;
}

const fileUploadInitialValues = {
  title: "",
  desc: "",
  file: null,
};

const fileValidation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  desc: Yup.string().required("Description is required"),
  file: Yup.mixed().required("Please select a file"),
});

const AddFileModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  errorMessage,
  fileAdded,
}: AddFileModalProps) => {
  return (
    <Modal
      header="Add New Files"
      subheader="Select Files to Upload"
      action={onClose}
      body={
        <Formik
          initialValues={fileUploadInitialValues}
          validationSchema={fileValidation}
          onSubmit={async (values, helpers) => {
            await onSubmit(values, helpers);
            helpers.resetForm(); // ✅ reset Formik fields
            const fileInput =
              document.querySelector<HTMLInputElement>('input[name="file"]');
            if (fileInput) fileInput.value = ""; // ✅ manually clear file input
            toast.success("File added successfully!");
          }}
        >
          {({ setFieldValue, errors, touched, isSubmitting }) => (
            <Form>
              <div className="Form-group">
                <label htmlFor="title">Title</label>
                <Field className="Form-input-box" type="text" name="title" />
                {errors.title && touched.title && (
                  <div className="Form-error">{errors.title}</div>
                )}
              </div>
              <div className="Form-group">
                <label htmlFor="desc">Description</label>
                <Field
                  as="textarea"
                  className="Form-input-box text-area"
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

              {errorMessage && <div className="Form-error">{errorMessage}</div>}
            </Form>
          )}
        </Formik>
      }
    />
  );
};

export default AddFileModal;
