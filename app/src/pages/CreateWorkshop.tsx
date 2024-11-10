import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Navbar from "../components/Navbar";

const CreateWorkshop = () => {
  // Initial form values
  const initialValues = {
    name: "",
    description: "",
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
  });

  // Handle form submission
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <Navbar />
      <h1>Create Workshop</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className="Form-group">
              <label htmlFor="name">Name</label>
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

            <div className="Form-group">
              <label htmlFor="description">Description</label>
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

            <button
              type="submit"
              className="Button Button-color--dark-1000 Width--100"
              disabled={isSubmitting} // Disable button while form is submitting
            >
              {isSubmitting ? "Submitting..." : "Create Workshop"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateWorkshop;
