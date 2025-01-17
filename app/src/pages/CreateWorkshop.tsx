import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";
import { api } from "../api";

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
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        s3id: "example-s3-id", // TODO: Placeholder for S3 ID until set up
      };

      await api.post("/api/create-workshop", payload);
      // api.ts deals with error responses !
    } catch (error) {
      console.error("Error creating workshop:", error);
      alert("Failed to create workshop. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="Block Width--70 Margin-right--80 Margin-left--80 Margin-top--40 Height--100vh">
        <div
          className="Flex-row Margin-bottom--40 Margin-left--40 Margin-right--100 Margin-top--30 Text-color--teal-1000 Text-fontSize--30"
          style={{
            borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
            paddingBottom: "10px",
          }}
        >
          Create Workshop
        </div>
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
                  <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                    <div className="name">Workshop Name:</div>
                  </div>
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
                  <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                    <div className="description">Workshop Description:</div>
                  </div>
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

                <div className="Flex-row Justify-content--center">
                  <button
                    type="submit"
                    className="Button Margin-top--30 Button-color--teal-1000 Width--50"
                    disabled={isSubmitting} // Disable button while form is submitting
                  >
                    {isSubmitting ? "Submitting..." : "Create Workshop"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CreateWorkshop;
