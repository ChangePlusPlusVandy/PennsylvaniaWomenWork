import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { api } from "../api";

interface MenteeInfo {
  _id: string; // Mentee's unique ID (MongoDB ObjectID or Auth0 ID)
  firstName: string;
  lastName: string;
  email: string;
  role: string; // e.g., "mentee"
  mentor?: string; // Optional mentor ID assigned to mentee
  workshops: string[]; // List of workshop names
}

const MenteeInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menteeId = location.state?.menteeId;
  const [mentee, setMentee] = useState<MenteeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Workshops");
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    if (!menteeId) {
      setError("Mentee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchMentee = async () => {
      try {
        console.log("Fetching mentee data for ID:", menteeId);
        const response = await api.get(`/api/mentee/get-mentee/${menteeId}`); // ✅ Fetch mentee data
        setMentee(response.data);
      } catch (err) {
        setError("Failed to load mentee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentee();
  }, [menteeId]);

  const initialValues = {
    courseName: "",
    startDate: "",
    description: "",
  };

  const validationSchema = yup.object({
    courseName: yup.string().required("Course name is required"),
    startDate: yup.date().required("Start date is required"),
    description: yup.string().required("Course description is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: any,
  ) => {
    try {
      console.log(values);
      setIsModal(false);
    } catch (error) {
      console.error("Error assigning course:", error);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className="Mentee-info-block">
        <div onClick={() => navigate("/home")} className=" Margin-bottom--10">
          <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
        </div>
        <div className="Flex-row--mentee-info">
          <div>
            <div className="Mentee-name--text">
              {mentee?.firstName} {mentee?.lastName}
            </div>
            <div className="Mentee-role--text">
              {mentee?.role || "No role assigned"}
            </div>
          </div>
        </div>

        <div className="Flex-row--mentee-description">
          <div className="Mentee-info--text">Information</div>
        </div>
        {/* <div className="Flex-row--mentee-bio">
          <div className="Mentee-description--text">
            {mentee.description || "No description available."}
          </div>
        </div> */}

        <div>
          <div>
            <div className="Flex-row--mentee-tabs">
              {["Workshops", "Meetings", "Schedule New"].map((tab) => (
                <div
                  key={tab}
                  className={`Mentee-tabs__tab ${activeTab === tab ? "Mentee-tabs__tab--active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            {activeTab === "Workshops" && (
              <div>
                <div className="Workshop-header">Current Workshops</div>
                <div className="List-style--none Margin-left--80">
                  {mentee?.workshops && mentee.workshops.length > 0 ? (
                    mentee.workshops.map((workshop: string, index: number) => (
                      <div key={index} className="Course-list-element">
                        <div className="Course-list-bullet" />
                        {workshop}
                      </div>
                    ))
                  ) : (
                    <p>No workshops assigned.</p>
                  )}
                </div>
                <div
                  className="Button Button-color--teal-1000 Margin-left--80"
                  onClick={() => setIsModal(true)}
                >
                  Assign New Courses
                </div>
              </div>
            )}

            {isModal && (
              <Modal
                header="Assign New Course"
                subheader="Add a new course for this mentee"
                action={() => setIsModal(false)}
                body={
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form>
                        <div className="Form-group">
                          <label htmlFor="courseName">Course Name</label>
                          <Field
                            className="Form-input-box"
                            type="text"
                            id="courseName"
                            name="courseName"
                            placeholder="Enter course name"
                          />
                          {errors.courseName && touched.courseName && (
                            <div className="Form-error">
                              {errors.courseName}
                            </div>
                          )}
                        </div>

                        <div className="Form-group">
                          <label htmlFor="startDate">Start Date</label>
                          <Field
                            className="Form-input-box"
                            type="date"
                            id="startDate"
                            name="startDate"
                          />
                          {errors.startDate && touched.startDate && (
                            <div className="Form-error">{errors.startDate}</div>
                          )}
                        </div>

                        <div className="Form-group">
                          <label htmlFor="description">Description</label>
                          <Field
                            className="Form-input-box"
                            as="textarea"
                            id="description"
                            name="description"
                            rows="3"
                            placeholder="Enter course description"
                          />
                          {errors.description && touched.description && (
                            <div className="Form-error">
                              {errors.description}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="Button Button-color--teal-1000 Width--100"
                          disabled={isSubmitting}
                        >
                          Assign Course
                        </button>
                      </Form>
                    )}
                  </Formik>
                }
              />
            )}

            {activeTab === "Meetings" && (
              <div>
                <div className="Calendar-upcoming">Upcoming</div>
                <div className="Flex-row-calendar">
                  <div className="Calendar-block">
                    <div className="Calendar-day">Wed</div>
                    <div className="Calendar-date">25</div>
                  </div>
                  <div>
                    <div className="Calendar-event">Mock Interview Session</div>
                    <div className="Calendar-description">
                      Practice your interview skills with an industry
                      professional
                    </div>
                  </div>
                </div>
                <div
                  className="Button Button-color--teal-1000 Width--40"
                  onClick={() => navigate("/create-meeting")}
                >
                  Add New Meeting Notes
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeInformation;
