import React from "react";
import { Formik, Form, Field } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance

const initialValues = {
  meeting: "",
  notes: "",
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Meeting name is required"),
  notes: Yup.string().required("Meeting notes are required"),
});

const CreateMeeting = () => {
  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    setSubmitting(true);
    try {
      const payload = {
        username: "sample-username", // TODO: Replace with the logged-in user's username
        meeting: values.meeting,
        notes: values.notes,
      };

      console.log("Submitting payload:", payload); // Debugging log

      await api.post("/user/add-meeting", payload);

      alert("Meeting added successfully!");

      resetForm(); // Clear the form after successful submission
    } catch (error) {
      console.error("Error adding meeting:", error);
      alert("Failed to add meeting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Block Width--70 Margin-right--80 Margin-left--80 Margin-top--40 Height--100vh">
        <div
          className="Flex-row Margin-bottom--40 Margin-left--40 Margin-right--100 Margin-top--30 Text-color--blue-1000 Text-fontSize--30"
          style={{
            borderBottom: "2px solid rgba(84, 84, 84, 0.3)",
            paddingBottom: "10px",
          }}
        >
          Create Meeting
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
                      <div className="name">Meeting Name:</div>
                    </div>
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
                </div>

                <div className="Margin-bottom--20">
                  <div className="Form-group">
                    <div className="Flex-row Text-fontSize--16 Text-color--gray-1000 Margin-bottom--8">
                      <div className="description">Notes:</div>
                    </div>
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
                </div>

                <div className="Flex-row Justify-content--center">
                  <button
                    type="submit"
                    className="Button Margin-top--30 Button-color--blue-1000 Width--50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Create Meeting"}
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

export default CreateMeeting;
