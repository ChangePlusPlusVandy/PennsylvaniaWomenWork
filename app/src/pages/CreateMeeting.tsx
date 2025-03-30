import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import Navbar from "../components/Navbar";
import * as Yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance
import Icon from "../components/Icon";

interface CreateMeetingFormValues {
  username: string;
  meeting: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarLink: string;
  participants: string[];
  role: string[];
}

const initialValues: CreateMeetingFormValues = {
  username: "",
  meeting: "",
  date: "",
  startTime: "",
  endTime: "",
  calendarLink: "",
  participants: [],
  role: [],
};

const roles = [
  { id: "mentee", label: "Mentee" },
  { id: "mentor", label: "Mentor" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
];

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  meeting: Yup.string().required("Meeting name is required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (endTime) {
        const { startTime } = this.parent;
        return !startTime || !endTime || startTime < endTime;
      },
    ),
  calendarLink: Yup.string()
    .url("Must be a valid URL")
    .required("Calendar link is required"),
  participants: Yup.array()
    .of(Yup.string())
    .min(1, "Add at least one participant"),
});

const CreateMeeting = () => {
  const [newParticipant, setNewParticipant] = useState("");

  const handleSubmit = async (
    values: CreateMeetingFormValues,
    { setSubmitting, resetForm }: any,
  ) => {
    setSubmitting(true);
    try {
      const baseDate = new Date(values.date);

      const [startHours, startMinutes] = values.startTime.split(":");
      const startDateTime = new Date(baseDate);
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

      const [endHours, endMinutes] = values.endTime.split(":");
      const endDateTime = new Date(baseDate);
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));

      const payload = {
        username: "sample-username", // TODO: Replace with logged-in username
        meeting: values.meeting,
        date: baseDate.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        participants: values.participants,
        calendarLink: values.calendarLink,
        role: values.role,
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
      <div className="FormWidget">
        <div className="FormWidget-body Block">
          <div className="Block-header">Create Meeting</div>
          <div className="Block-subtitle">Add a new meeting</div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, isSubmitting, setFieldValue }) => (
              <Form>
                <div className="Form-group">
                  <label htmlFor="meeting">Meeting Name</label>
                  <Field
                    type="text"
                    name="meeting"
                    className="Form-input-box"
                    placeholder="Enter meeting name"
                  />
                  {errors.meeting && touched.meeting && (
                    <div className="Form-error">{errors.meeting}</div>
                  )}
                </div>

                <div className="Form-group">
                  <label htmlFor="date">Date</label>
                  <Field type="date" name="date" className="Form-input-box" />
                  {errors.date && touched.date && (
                    <div className="Form-error">{errors.date}</div>
                  )}
                </div>
                <div className="Flex-row">
                  <div className="Form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <Field
                      type="time"
                      name="startTime"
                      className="Form-input-box Margin-right--4"
                    />
                    {errors.startTime && touched.startTime && (
                      <div className="Form-error">{errors.startTime}</div>
                    )}
                  </div>

                  <div className="Form-group">
                    <label htmlFor="endTime">End Time</label>
                    <Field
                      type="time"
                      name="endTime"
                      className="Form-input-box Margin-left--4"
                    />
                    {errors.endTime && touched.endTime && (
                      <div className="Form-error">{errors.endTime}</div>
                    )}
                  </div>
                </div>

                <div className="Form-group">
                  <label htmlFor="calendarLink">Calendar Link</label>
                  <Field
                    type="text"
                    name="calendarLink"
                    className="Form-input-box"
                    placeholder="https://..."
                  />
                  {errors.calendarLink && touched.calendarLink && (
                    <div className="Form-error">{errors.calendarLink}</div>
                  )}
                </div>

                <div className="Form-group">
                  <label>Participants</label>
                  <div className="Flex-row Align-items--center">
                    <Field
                      type="text"
                      value={newParticipant}
                      onChange={(e: {
                        target: { value: React.SetStateAction<string> };
                      }) => setNewParticipant(e.target.value)}
                      placeholder="Enter participant name"
                      className="Form-input-box"
                      style={{ flex: 1 }}
                    />
                    <div
                      className="Text-colorHover--green-1000"
                      onClick={() => {
                        if (newParticipant.trim()) {
                          setFieldValue("participants", [
                            ...values.participants,
                            newParticipant.trim(),
                          ]);
                          setNewParticipant("");
                        }
                      }}
                      style={{ marginLeft: "8px" }}
                    >
                      <Icon glyph="plus" />
                    </div>
                  </div>
                  {errors.participants && touched.participants && (
                    <div className="Form-error">{errors.participants}</div>
                  )}
                  {values.participants && values.participants.length > 0 && (
                    <ul>
                      {values.participants.map((participant, index) => (
                        <li key={index}>
                          {participant}{" "}
                          <div
                            className="Text-colorHover--red-1000"
                            onClick={() => {
                              const newParticipants = [...values.participants];
                              newParticipants.splice(index, 1);
                              setFieldValue("participants", newParticipants);
                            }}
                            style={{ marginLeft: "4px" }}
                          >
                            <Icon glyph="times" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="Flex-row Justify-content--center">
                  <button
                    type="submit"
                    className="Button Button-color--blue-1000 Width--100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Meeting"}
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
