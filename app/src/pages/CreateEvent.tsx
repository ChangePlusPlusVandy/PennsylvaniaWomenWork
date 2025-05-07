import React from "react";
import Navbar from "../components/Navbar";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as yup from "yup";
import { api } from "../api"; // Ensure this points to your configured API instance
import { toast } from "react-hot-toast";

interface CreateEventFormValues {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarLink: string;
  roles: string[];
  participants: string[];
}

const initialValues: CreateEventFormValues = {
  name: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  calendarLink: "",
  roles: [],
  participants: [],
};

const roleOptions = [
  { id: "mentee", label: "Participants" },
  { id: "mentor", label: "Volunteers" },
  { id: "staff", label: "Staff" },
  { id: "board", label: "Board" },
];

const getValidationSchema = (useTime: boolean) =>
  yup.object().shape({
    name: yup.string().required("Event name is required"),
    description: yup.string().required("Description is required"),
    date: yup.string().required("Date is required"),
    startTime: useTime
      ? yup.string().required("Start time is required")
      : yup.string().nullable(),
    endTime: useTime
      ? yup
          .string()
          .required("End time is required")
          .test(
            "is-after-start",
            "End time must be after start time",
            function (endTime) {
              const { startTime } = this.parent;
              return !startTime || !endTime || startTime < endTime;
            },
          )
      : yup.string().nullable(),
    calendarLink: yup.string().url("Must be a valid URL").nullable(),
  });

const CreateEvent = () => {
  const [useTime, setUseTime] = React.useState(false);

  const handleSubmit = async (
    values: CreateEventFormValues,
    { setSubmitting, resetForm }: FormikHelpers<CreateEventFormValues>,
  ) => {
    try {
      const baseDate = new Date(values.date);

      let startDateTime: Date | null = null;
      let endDateTime: Date | null = null;

      if (useTime) {
        const [startHours, startMinutes] = values.startTime.split(":");
        startDateTime = new Date(baseDate);
        startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));

        const [endHours, endMinutes] = values.endTime.split(":");
        endDateTime = new Date(baseDate);
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
      }

      const payload = {
        name: values.name,
        description: values.description,
        date: baseDate.toISOString(),
        startTime: startDateTime?.toISOString() || baseDate.toISOString(),
        endTime: endDateTime?.toISOString() || baseDate.toISOString(),
        expirationDate: !useTime ? baseDate.toISOString() : undefined,
        userIds: values.participants || [],
        audienceRoles: values.roles || [],
        calendarLink: values.calendarLink || undefined,
      };

      await api.post("/api/event", payload);
      toast.success("Event created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="FormWidget">
        <div className="FormWidget-body Block">
          <div className="Block-header">Create New Event</div>
          <div className="Block-subtitle">Add information about your event</div>

          <Formik
            initialValues={initialValues}
            validationSchema={getValidationSchema(useTime)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="Form-group">
                  <label htmlFor="name">Event Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="Form-input-box"
                    placeholder="Enter event name"
                  />
                  {errors.name && touched.name && (
                    <div className="Form-error">{errors.name}</div>
                  )}
                </div>
                <div className="Form-group">
                  <label htmlFor="description">Description</label>
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
                  <label htmlFor="date">
                    {useTime ? "Event Date" : "Expiration Date"}
                  </label>
                  <Field type="date" name="date" className="Form-input-box" />
                  {errors.date && touched.date && (
                    <div className="Form-error">{errors.date}</div>
                  )}
                </div>
                <div className="Form-group">
                  <label>Event Type</label>
                  <div className="Role-tags">
                    <div className="Role-tag-item">
                      <input
                        type="radio"
                        id="event-type-time"
                        name="eventType"
                        className="Role-tag-input"
                        checked={useTime === true}
                        onChange={() => setUseTime(true)}
                      />
                      <label
                        htmlFor="event-type-time"
                        className="Role-tag-label"
                      >
                        Happens at a Specific Time
                      </label>
                    </div>
                    <div className="Role-tag-item">
                      <input
                        type="radio"
                        id="event-type-expire"
                        name="eventType"
                        className="Role-tag-input"
                        checked={useTime === false}
                        onChange={() => setUseTime(false)}
                      />
                      <label
                        htmlFor="event-type-expire"
                        className="Role-tag-label"
                      >
                        Only Has an Expiration Date
                      </label>
                    </div>
                  </div>
                </div>
                {useTime && (
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
                )}
                <div className="Form-group">
                  <label htmlFor="calendarLink">Calendar Link (optional)</label>
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
                  <label>Audience</label>
                  <div className="Role-tags">
                    {roleOptions.map((role) => (
                      <div key={role.id} className="Role-tag-item">
                        <Field
                          type="checkbox"
                          name="roles"
                          value={role.id}
                          id={`role-${role.id}`}
                          className="Role-tag-input"
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
                </div>
                <div className="Flex-row Justify-content--center Margin-top--20">
                  <button
                    type="submit"
                    className="Button Button-color--blue-1000 Width--100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
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

export default CreateEvent;
