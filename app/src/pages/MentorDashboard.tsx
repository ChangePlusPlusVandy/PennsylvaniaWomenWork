import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import CreateEventModal from "../components/CreateEvent";
import Event, { EventData } from "../components/Event";
import { useUser } from "../contexts/UserContext";
import { api } from "../api";

interface Mentee {
  _id: string;
  firstName: string;
  lastName: string;
}

interface MenteeInformationElements {
  id: number;
  menteeName: string;
}

interface CourseInformationElements {
  id: number;
  courseName: string;
}

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("My Mentees");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const { user } = useUser();
  const userId = user?._id;
  useEffect(() => {
    if (!user) {
      return;
    }

    if (!userId || user.role !== "mentor") {
      setError("Only mentors can view mentees.");
      setLoading(false);
      return;
    }
    console.log("userId", userId);

    const fetchUserEvents = async () => {
      try {
        const response = await api.get(`/api/event/${userId}`);
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events.");
      }
    };

    const fetchMentees = async () => {
      try {
        const encodedUserId = encodeURIComponent(userId); // ✅ URL-safe encoding
        const response = await api.get(`/api/mentor/${encodedUserId}/mentees`);
        setMentees(
          Array.isArray(response.data.mentees) ? response.data.mentees : [],
        );
        setLoading(false);
      } catch (err) {
        setError("Unable to fetch mentees.");
        setLoading(false);
      }
    };

    fetchMentees();
    fetchUserEvents();
  }, [user, userId]);

  const eventsByMonth: { [key: string]: EventData[] } = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort events chronologically
    .reduce(
      (acc, event) => {
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString("default", { month: "long" });

        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push({
          ...event,
          formattedDate: eventDate.toDateString(),
        });

        return acc;
      },
      {} as { [key: string]: EventData[] },
    );

  const menteeGridData = Array.isArray(mentees) // Parse mentee data
    ? mentees.map((mentee) => ({
        id: mentee._id,
        menteeName: `${mentee.firstName} ${mentee.lastName}`,
      }))
    : []; // Initialize empty array

  const courseGridData: CourseInformationElements[] = [
    {
      id: 1,
      courseName: "Resume",
    },
  ];

  const handleClick = (menteeId: string) => {
    navigate("/mentor/mentee-information", { state: { menteeId } });
  };

  const handleClickWorkshop = (id: number) => {
    navigate("/mentor/workshop-information", { state: { workshopId: id } });
  };

  const handleCreateEvent = async (eventData: {
    name: string;
    description: string;
    date: string;
    roles: string[]; // ✅ new field
    calendarLink?: string;
  }) => {
    try {
      const response = await api.post(`/api/event`, eventData);
      console.log("Event created:", response.data.event);

      // Add new event to the state
      setEvents((prev) => [...prev, response.data.event]);
      setCreateEventModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Error creating event.");
    }
  };

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={`${new Date(selectedEvent.date).toLocaleString("default", { month: "long" })} ${new Date(selectedEvent.date).getDate()}, ${new Date(selectedEvent.date).getFullYear()}`}
          body={
            <>
              {selectedEvent.description}
              <div>
                <a
                  href={selectedEvent.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Add to Calendar
                </a>
              </div>
            </>
          }
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
                {loading ? (
                  <p>Loading mentees...</p>
                ) : error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : mentees.length > 0 ? (
                  <div className="row gx-3 gy-3">
                    {menteeGridData.map((mentee) => (
                      <div className="col-lg-4" key={mentee.id}>
                        <div
                          className="Mentor--card"
                          onClick={() => handleClick(mentee.id)}
                        >
                          <div className="Mentor--card-color Background-color--teal-1000" />
                          <div className="Padding--10">
                            <h3 className="Text-fontSize--20 Text-color--gray-600">
                              {mentee.menteeName}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No mentees found.</p>
                )}
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
              <Event
                key={month}
                month={month}
                events={monthEvents}
                onEventClick={handleEventClick}
              />
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
