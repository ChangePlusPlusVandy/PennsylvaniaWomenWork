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
  username: string;
}

interface Mentor {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface Workshop {
  _id: string;
  name: string;
  description: string;
}

const StaffBoardDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [createEventModal, setCreateEventModal] = useState(false);
  const [activeTab, setActiveTab] = useState("All Mentees");

  const userId = user?._id;

  useEffect(() => {
    const fetchAllMentees = async () => {
      try {
        const response = await api.get(`/api/user/all-mentees`);
        const formatted = (response.data || []).map((mentee: any) => ({
          _id: mentee._id,
          username: mentee.username,
          firstName: mentee.first_name,
          lastName: mentee.last_name,
        }));
        setMentees(formatted);
      } catch (err) {
        console.error("Error fetching mentees:", err);
      }
    };

    const fetchAllMentors = async () => {
      try {
        const response = await api.get(`/api/user/all-mentors`);
        const formatted = (response.data || []).map((mentor: any) => ({
          _id: mentor._id,
          username: mentor.username,
          firstName: mentor.first_name,
          lastName: mentor.last_name,
        }));
        setMentors(formatted);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      }
    };

    const fetchAllWorkshops = async () => {
      try {
        const response = await api.get(`/api/workshop/all`);
        setWorkshops(response.data || []);
      } catch (err) {
        console.error("Error fetching workshops:", err);
      }
    };

    const fetchEvents = async () => {
      try {
        if (!userId) return;
        const response = await api.get(`/api/event/${userId}`);
        setEvents(
          response.data.map((event: any) => ({
            name: event.name,
            description: event.description,
            date: event.date,
            userIds: event.users || [],
            calendarLink: event.calendarLink || "",
          })),
        );
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchAllMentees();
    fetchAllMentors();
    fetchAllWorkshops();
    fetchEvents();
  }, [userId]);

  const eventsByMonth: { [key: string]: EventData[] } = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce(
      (acc, event) => {
        const eventDate = new Date(event.date);
        const month = eventDate.toLocaleString("default", { month: "long" });

        if (!acc[month]) acc[month] = [];
        acc[month].push({
          ...event,
          formattedDate: eventDate.toDateString(),
        });

        return acc;
      },
      {} as { [key: string]: EventData[] },
    );

  const handleClickMentee = (menteeId: string) => {
    navigate("/mentor/mentee-information", { state: { menteeId } });
  };

  const handleClickWorkshop = (workshopId: string) => {
    navigate("/mentor/workshop-information", { state: { workshopId } });
  };

  const handleCreateEvent = async (eventData: {
    name: string;
    description: string;
    date: string;
    roles: string[];
    calendarLink?: string;
  }) => {
    try {
      const response = await api.post(`/api/event`, eventData);
      setEvents((prev) => [...prev, response.data.event]);
      setCreateEventModal(false);
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <>
      <Navbar />

      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={new Date(selectedEvent.date).toLocaleDateString()}
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
          onSubmit={handleCreateEvent}
        />
      )}

      <div className="row g-3 Margin--20">
        <div className="col-lg-8">
          <div className="Block p-3">
            <div className="Flex-row Margin-bottom--30">
              {["All Mentees", "All Mentors", "All Courses"].map((tab) => (
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

            {activeTab === "All Mentees" && (
              <div className="row gx-3 gy-3">
                {mentees.map((mentee) => (
                  <div className="col-lg-4" key={mentee._id}>
                    <div
                      className="Mentor--card"
                      onClick={() => handleClickMentee(mentee._id)}
                    >
                      <div className="Mentor--card-color Background-color--teal-1000" />
                      <div className="Padding--10">
                        <h3 className="Text-fontSize--18 Text-color--gray-600">
                          {mentee.firstName && mentee.lastName
                            ? `${mentee.firstName} ${mentee.lastName}`
                            : mentee.username}
                        </h3>
                        <p className="Text-fontSize--14 Text-color--gray-500">
                          {mentee.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "All Courses" && (
              <div className="row gx-3 gy-3">
                {workshops.map((workshop) => (
                  <div className="col-lg-4" key={workshop._id}>
                    <div
                      className="Mentor--card"
                      onClick={() => handleClickWorkshop(workshop._id)}
                    >
                      <div className="Mentor--card-color Background-color--teal-1000" />
                      <div className="Padding--10">
                        <h3 className="Text-fontSize--18 Text-color--gray-600">
                          {workshop.name}
                        </h3>
                        <p className="Text-fontSize--14 Text-color--gray-500">
                          {workshop.description.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "All Mentors" && (
              <div className="row gx-3 gy-3">
                {mentors.map((mentor) => (
                  <div className="col-lg-4" key={mentor._id}>
                    <div className="Mentor--card">
                      <div className="Mentor--card-color Background-color--teal-1000" />
                      <div className="Padding--10">
                        <h3 className="Text-fontSize--18 Text-color--gray-600">
                          {mentor.firstName && mentor.lastName
                            ? `${mentor.firstName} ${mentor.lastName}`
                            : mentor.username}
                        </h3>
                        <p className="Text-fontSize--14 Text-color--gray-500">
                          {mentor.username}
                        </p>
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
                onEventClick={setSelectedEvent}
              />
            ))}

            <div
              className="Button Button-color--blue-1000"
              onClick={() => setCreateEventModal(true)}
            >
              Add New Event
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffBoardDashboard;
