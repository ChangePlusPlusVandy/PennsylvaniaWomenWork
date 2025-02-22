import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

import Event, { EventData } from "../components/Event";

interface CourseInformationElements {
  id: number;
  courseName: string;
}

const MenteeDashboard = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventData[]>([]);
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([]);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
  const userId = "64a6b8c5f5c6dca8ef18d1f1"; // TODO: Replace with actual mentee user ID

  const fetchEvents = async () => {
    try {
      if (!userId) {
        console.error("Error: userId is undefined");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/event/${userId}`);
      console.log("Fetched Events for Mentee:", response.data);

      const parsedEvents: EventData[] = response.data.map((event: any) => ({
        id: event._id,
        title: event.name,
        description: event.description,
        date: event.date,
        month: new Date(event.date).toLocaleString("default", {
          month: "long",
        }),
      }));

      setEvents(parsedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchWorkshops = async () => {
    try {
      if (!userId) {
        console.error("Error: userId is undefined");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/workshop/user/${userId}`);
      console.log("Fetched Workshops:", response.data);

      const parsedWorkshops: CourseInformationElements[] = response.data.map((workshop: any) => ({
        id: workshop._id,
        courseName: workshop.name,
      }));

      setWorkshops(parsedWorkshops);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    }
  };


  useEffect(() => {
    fetchEvents();
    fetchWorkshops();
  }, []);

  const handleClick = (id: number) => {
    navigate(`/mentee/course-information/`);
  };

  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // const events: EventData[] = [
  //   {
  //     id: 1,
  //     day: "wed",
  //     date: "25",
  //     month: "June",
  //     title: "Mock Interview Session",
  //     description:
  //       "Practice your interview skills with an industry professional",
  //     fullDescription:
  //       "Join us for a comprehensive mock interview session where industry professionals will provide real-world interview scenarios and valuable feedback. You'll get hands-on experience with common interview questions and learn techniques to improve your performance.",
  //   },
  //   {
  //     id: 2,
  //     day: "fri",
  //     date: "27",
  //     month: "June",
  //     title: "Resume Workshop",
  //     description: "Develop your resume with a senior employee",
  //     fullDescription:
  //       "Work directly with senior employees to craft a compelling resume. Learn about industry best practices, how to highlight your achievements, and get personalized feedback on your current resume. Bring your laptop and current resume for hands-on improvements.",
  //   },
  //   {
  //     id: 3,
  //     day: "mon",
  //     date: "1",
  //     month: "July",
  //     title: "Networking Event",
  //     description: "Connect with industry professionals",
  //     fullDescription:
  //       "Join us for an evening of networking with senior members in your desired field.",
  //   },
  // ];

  // const courseGridData: CourseInformationElements[] = [
  //   { id: 1, courseName: "Resume" },
  //   { id: 2, courseName: "Networking" },
  //   { id: 3, courseName: "Interviewing" },
  // ];


  const courseGridData: CourseInformationElements[] = [
    ...workshops,
  ];


  // const eventsByMonth: { [key: string]: EventData[] } = events.reduce(
  //   (acc, event) => {
  //     if (!acc[event.month]) {
  //       acc[event.month] = [];
  //     }
  //     acc[event.month].push(event);
  //     return acc;
  //   },
  //   {} as { [key: string]: EventData[] },
  // );

  const eventsByMonth: { [key: string]: EventData[] } = events.reduce(
    (acc, event) => {
      if (!acc[event.month]) {
        acc[event.month] = [];
      }
      acc[event.month].push(event);
      return acc;
    },
    {} as { [key: string]: EventData[] },
  );

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.title}
          subheader={`${selectedEvent.month} ${new Date(selectedEvent.date).getDate()}, ${new Date(selectedEvent.date).getFullYear()}`}
          body={<>{selectedEvent.description}</>}
          action={() => setSelectedEvent(null)}
        />
      )}
      <div className="row g-3 Margin--20">
        {/* Left Section */}
        <div className="col-lg-8">
          <div className="Block p-3">
            {" "}
            {/* Add padding inside */}
            <div className="Block-header">My courses</div>
            <div className="Block-subtitle">
              Select a course to access materials.
            </div>
            <div className="row gx-3 gy-3">
              {courseGridData.map((item) => (
                <div className="col-lg-4">
                  <div
                    className="Workshop-card"
                    onClick={() => handleClick(item.id)}
                  >
                    <div className="Workshop-card-color Background-color--teal-1000" />
                    <div className="Padding--10">
                      <h3 className="Text-fontSize--20 Text-color--gray-600">
                        {item.courseName}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-4">
          <div className="Block p-3">
            {" "}
            {/* Add padding inside */}
            <div className="Block-header">Upcoming Events</div>
            <div className="Block-subtitle">Select an event to register.</div>
            {/* {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month} className="Event">
                <div className="Event-month">{month}</div>

                {monthEvents.map((event) => (
                  <div
                    className="Event-item"
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="Flex-column--centered Margin-right--30">
                      <div>{event.day}</div>
                      <div className="Text-fontSize--30">{event.date}</div>
                    </div>
                    <div className="Flex-column Text-bold">
                      <span className="Margin-bottom--4">{event.title}</span>
                      <div className="Text-fontSize--14">
                        {event.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))} */}
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month} style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {month}
                </h3>

                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)} // ✅ Click event opens modal
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      background: "#f9f9f9",
                      borderRadius: "5px",
                      marginBottom: "8px",
                      cursor: "pointer", // Indicates the event is clickable
                    }}
                  >
                    {/* Date */}
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#333",
                        minWidth: "90px",
                        textAlign: "left",
                      }}
                    >
                      {new Date(event.date).toLocaleDateString()}
                    </div>

                    {/* Event Details */}
                    <div style={{ flexGrow: 1, paddingLeft: "10px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {event.title}
                      </span>
                      {" - "}
                      <span style={{ fontSize: "14px", color: "#666" }}>
                        {event.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default MenteeDashboard;
