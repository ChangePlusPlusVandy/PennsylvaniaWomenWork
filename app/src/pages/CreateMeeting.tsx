import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";

const CreateMeeting = () => {
  const initialValues = {
    meeting: "",
    notes: "",
  };
  const validationSchema = Yup.object().shape({
    meeting: Yup.string().required("Please enter a meeting name"),
    notes: Yup.string().required("Please enter meeting notes"),
  });
  const handleSubmit = (values: any) => {
    console.log(values);
  };
  return (
    <>
      <Navbar />
      <h1>Create Meeting</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <div className="Form-group">
              <label htmlFor="name">Meeting Name</label>
              <Field
                type="text"
                name="meeting"
                placeholder="Meeting Name"
                className="Form-input-box"
              />
              {errors.meeting && touched.meeting && (
                <div className="Form-error">{errors.meeting}</div>
              )}
            </div>
            <div className="Form-group">
              <label htmlFor="notes">Notes</label>
              <Field
                type="text"
                name="notes"
                placeholder="Notes"
                className="Form-input-box"
              />
              {errors.notes && touched.notes && (
                <div className="Form-error">{errors.notes}</div>
              )}
            </div>
            <button
              type="submit"
              className="Button Button-color--dark-1000 Width--100"
            >
              Create Meeting
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateMeeting;
