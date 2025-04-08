import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import FolderCard from "../components/FolderCard";
import Event, {
  EventData,
  parseEvents,
  groupEventsByMonth,
  formatEventSubheader,
} from "../components/Event";
import FolderUI from "../components/FolderUI";

interface Folder {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  coverImageS3id?: string;
  tags?: string[];
}

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const { user } = useUser();
  const userId = user?._id;
  const [loading, setLoading] = useState(true);
  const start = selectedEvent ? new Date(selectedEvent.startTime) : null;
  const end = selectedEvent ? new Date(selectedEvent.endTime) : null;
  const eventDate = selectedEvent ? new Date(selectedEvent.date) : null;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [eventsResponse, workshopsResponse] = await Promise.all([
          api.get(`/api/event/${userId}`),
          api.get(`/api/mentee/${userId}/workshops`),
        ]);

        const parsed = parseEvents(eventsResponse.data);
        setEvents(parsed);

        setFolders(workshopsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const eventsByMonth = groupEventsByMonth(events);
  const formattedSubheader = selectedEvent
    ? formatEventSubheader(selectedEvent)
    : "";

  const monthsWithEvents = Object.entries(eventsByMonth).filter(
    ([_, events]) => events.length > 0,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={formattedSubheader}
          body={
            <div className="Flex-column">
              {selectedEvent.description}
              {selectedEvent.calendarLink && (
                <a
                  href={selectedEvent.calendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="Button Button-color--blue-1000 Margin-top--10"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Go to Link
                </a>
              )}
            </div>
          }
          action={() => setSelectedEvent(null)}
        />
      )}
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="Block">
              <div className="Block-header">My Folders</div>
              <div className="Block-subtitle">
                Select a folder to access materials.
              </div>
              <FolderUI
                folders={folders}
                allTags={[]} // if you don’t have tags, keep it empty for now
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="Block p-3">
              <div className="Block-header">Upcoming Events</div>
              <div className="Block-subtitle">Select an event for details.</div>
              {monthsWithEvents.length === 0 ? (
                <div className="Text--center">No upcoming events</div>
              ) : (
                monthsWithEvents.map(([month, monthEvents]) => (
                  <Event
                    key={month}
                    month={month}
                    events={monthEvents}
                    onEventClick={handleEventClick}
                  />
                ))
              )}

              {/* Add Schedule Meeting button for mentees */}
              <div
                className="Button Button-color--blue-1000 Margin-top--10"
                onClick={() => navigate("/create-meeting")}
              >
                Schedule Meeting
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenteeDashboard;
