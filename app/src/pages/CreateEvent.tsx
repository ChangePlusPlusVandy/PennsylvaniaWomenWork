import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as yup from "yup";
import Navbar from "../components/Navbar";
import { api } from "../api";
import { useUser } from "../contexts/UserContext";

// Form values
interface CreateEventFormValues {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  invitationLink: string;
  roles: string[];
}

const initialValues: CreateEventFormValues = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  invitationLink: "",
  roles: [],
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Event name is required"),
  description: yup.string().required("Description is required"),
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup
    .string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (endTime) {
        const { startTime } = this.parent;
        return !startTime || !endTime || startTime < endTime;
      },
    ),
  invitationLink: yup
    .string()
    .url("Must be a valid URL")
    .required("Invitation link is required"),
});

const CreateEvent = () => {
  const { user } = useUser();

  const handleSubmit = async (
    values: CreateEventFormValues,
    { setSubmitting, resetForm }: FormikHelpers<CreateEventFormValues>,
  ) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        date: new Date(values.date).toISOString(),
        calendarLink: values.invitationLink,
        roles: values.roles,
      };

      console.log("Submitting event:", payload);
      await api.post("/api/event", payload);

      alert("Event created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="Flex-column Align-items--center Margin-top--40">
        <div className="Block Create-block">
          <div className="Block-header">Create Event</div>
          <div className="Block-subtitle">Add a new calendar event</div>
          <div className="Block-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="Form-group">
                    <label htmlFor="name">Event Name</label>
                    <Field name="name" type="text" className="Form-input-box" />
                    {errors.name && touched.name && (
                      <div className="Form-error">{errors.name}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="description">Description</label>
                    <Field
                      name="description"
                      type="text"
                      className="Form-input-box"
                    />
                    {errors.description && touched.description && (
                      <div className="Form-error">{errors.description}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="date">Date</label>
                    <Field name="date" type="date" className="Form-input-box" />
                    {errors.date && touched.date && (
                      <div className="Form-error">{errors.date}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <Field
                      name="startTime"
                      type="time"
                      className="Form-input-box"
                    />
                    {errors.startTime && touched.startTime && (
                      <div className="Form-error">{errors.startTime}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="endTime">End Time</label>
                    <Field
                      name="endTime"
                      type="time"
                      className="Form-input-box"
                    />
                    {errors.endTime && touched.endTime && (
                      <div className="Form-error">{errors.endTime}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="invitationLink">Calendar Link</label>
                    <Field
                      name="invitationLink"
                      type="text"
                      className="Form-input-box"
                    />
                    {errors.invitationLink && touched.invitationLink && (
                      <div className="Form-error">{errors.invitationLink}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label>Audience</label>
                    <div role="group" aria-labelledby="checkbox-group">
                      <label>
                        <Field type="checkbox" name="roles" value="all" />
                        All Users
                      </label>
                      <label>
                        <Field type="checkbox" name="roles" value="mentor" />
                        Mentors
                      </label>
                      <label>
                        <Field type="checkbox" name="roles" value="mentee" />
                        Mentees
                      </label>
                      <label>
                        <Field type="checkbox" name="roles" value="staff" />
                        Staff
                      </label>
                      <label>
                        <Field type="checkbox" name="roles" value="board" />
                        Board
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="Button Button-color--blue-1000 Width--100 Margin-top--10"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
