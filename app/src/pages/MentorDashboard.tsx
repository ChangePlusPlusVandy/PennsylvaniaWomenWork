import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import CreateEventModal from "../components/CreateEvent";
import Event, { EventData } from "../components/Event";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

interface MenteeInformationElements {
  id: number;
  menteeName: string;
}

interface CourseInformationElements {
  id: number;
  courseName: string;
}

const handleClick = (item: MenteeInformationElements) => {
  console.log("Clicked:", item);
};

const MentorDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("My Mentees");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const userId = "64a6b8c5f5c6dca8ef18d1f1"; // TODO: Replace with actual user ID

  const fetchEvents = async () => {
    try {
      if (!userId) {
        console.error("Error: userId is undefined");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/event/${userId}`);
      console.log("Fetched Raw Events:", response.data);

      const parsedEvents: EventData[] = response.data.map((event: any) => ({
        id: event._id,
        title: event.name,
        description: event.description,
        date: event.date,
        month: new Date(event.date).toLocaleString("default", {
          month: "long",
        }),
      }));

      console.log("Parsed Events:", parsedEvents);
      setEvents(parsedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateEvent = async (eventData: {
    name: string;
    description: string;
    date: string;
    userIds: string[];
    calendarLink?: string;
  }) => {
    try {
      console.log("Submitting Event:", eventData); // Debugging

      const response = await axios.post(`${API_BASE_URL}/api/event`, eventData);
      console.log("Event Created:", response.data);

      setEvents((prev) => [...prev, response.data.event]); // Update state
      setCreateEventModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // const events: EventData[] = [
  //   {
  //     id: 1,
  //     day: "wed",
  //     date: "25",
  //     month: "June",
  //     title: "Meeting with Jane",
  //     description: "One-on-one meeting with Jane to discuss her career goals",
  //     fullDescription:
  //       "One-on-one meeting with Jane to discuss her career goals.",
  //   },
  //   {
  //     id: 2,
  //     day: "fri",
  //     date: "27",
  //     month: "June",
  //     title: "Meeting with John",
  //     description: "One-on-one meeting with John to discuss his career goals",
  //     fullDescription:
  //       "One-on-one meeting with John to discuss his career goals.",
  //   },
  //   {
  //     id: 3,
  //     day: "mon",
  //     date: "1",
  //     month: "July",
  //     title: "Mentor Networking Event",
  //     description: "Connecting with other mentors and industry professionals",
  //     fullDescription:
  //       "Discussion with other mentors and industry professionals about their work, best practices, and more.",
  //   },
  // ];

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
      const eventDate = new Date(event.date); // Convert date string to Date object
      const month = eventDate.toLocaleString("default", { month: "long" });

      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push({
        ...event,
        formattedDate: eventDate.toDateString(), // Human-readable format
      });

      return acc;
    },
    {} as { [key: string]: EventData[] },
  );

  const menteeGridData: MenteeInformationElements[] = [
    {
      id: 1,
      menteeName: "Jane Doe",
    },
    {
      id: 2,
      menteeName: "John Doe",
    },
  ];

  const courseGridData: CourseInformationElements[] = [
    {
      id: 1,
      courseName: "Resume",
    },
  ];

  const handleClick = (id: number) => {
    navigate(`/mentor/mentee-information/`);
  };

  const handleClickWorkshop = (id: number) => {
    navigate(`/mentor/workshop-information/`);
  };

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

      {createEventModal && (
        <CreateEventModal
          isOpen={createEventModal}
          onClose={() => setCreateEventModal(false)}
          onSubmit={handleCreateEvent} // Pass event creation function
        />
      )}

      <div className="row g-3 Margin--20">
        <div className="col-lg-8">
          <div className="Block p-3">
            <div className="Flex-row Margin-bottom--30">
              {["My Mentees", "Courses"].map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={
                    "Cursor--pointer Padding-bottom--8 Margin-right--32 Text-fontSize--20 " +
                    (activeTab === tab
                      ? "Border-bottom--blue Text-color--gray-1000"
                      : "Text-color--gray-600")
                  }
                  style={{
                    cursor: "pointer",
                    paddingBottom: "8px",
                    borderBottom:
                      activeTab === tab
                        ? "2px solid #0096C0"
                        : "2px solid transparent",
                    marginRight: "48px",
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {activeTab === "My Mentees" && (
              <div>
                <div className="row gx-3 gy-3">
                  {menteeGridData.map((item) => (
                    <div className="col-lg-4" key={item.id}>
                      <div
                        className="Mentor--card"
                        onClick={() => handleClick(item.id)}
                      >
                        <div className="Mentor--card-color Background-color--teal-1000" />
                        <div className="Padding--10">
                          <h3 className="Text-fontSize--20 Text-color--gray-600">
                            {item.menteeName}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Courses" && (
              <div className="row gx-3 gy-3">
                {courseGridData.map((item) => (
                  <div className="col-lg-4" key={item.id}>
                    <div
                      className="Mentor--card"
                      onClick={() => handleClickWorkshop(item.id)}
                    >
                      <div className="Mentor--card-color Background-color--teal-1000" />
                      <div className="Padding--10">
                        <h3 className="Text-fontSize--20 Text-color--gray-600">
                          {item.courseName}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="Block p-3">
            <div className="Block-header">Upcoming Events</div>
            <div className="Block-subtitle">
              Scheduled meetings and workshops
            </div>
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
                    onClick={() => setSelectedEvent(event)} // ✅ Click event sets selectedEvent
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      background: "#f9f9f9",
                      borderRadius: "5px",
                      marginBottom: "8px",
                      cursor: "pointer", // Indicate it's clickable
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

            <div
              className="Button Button-color--blue-1000"
              onClick={() => {
                setCreateEventModal(true);
              }}
            >
              Add New Event
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorDashboard;
