import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { api } from "../api";
import Event, {
  EventData,
  parseEvents,
  groupEventsByMonth,
  formatEventSubheader,
} from "../components/Event";
import { useUser } from "../contexts/UserContext";
import FolderUI from "../components/FolderUI";

interface Folder {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  coverImageS3id?: string;
  tags?: string[];
}

const BoardDashboard = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const { user } = useUser();
  const userId = user?._id;
  const [possibleTags, setPossibleTags] = useState<string[]>([]);

  const formattedSubheader = selectedEvent
    ? formatEventSubheader(selectedEvent)
    : "";

  const eventsByMonth = groupEventsByMonth(events);

  useEffect(() => {
    if (!userId) return;

    const fetchEvents = async () => {
      try {
        const response = await api.get(`/api/event/${userId}`);
        const parsed = parseEvents(response.data);
        setEvents(parsed);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(`/api/board/get-files`);
        setFolders(
          response.data.map((file: any) => ({
            _id: file._id, // <-- this was missing!
            name: file.name,
            description: file.description,
            s3id: file.s3id,
            tags: file.tags || [],
          })),
        );
      } catch (error) {
        console.error("Error fetching board files:", error);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/api/board/get-tags");
        setPossibleTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

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
              <div className="Block-header">All Files</div>
              <div className="Block-subtitle">
                Select a file to access materials.
              </div>
              <FolderUI
                folders={folders}
                allTags={possibleTags}
                imageUrls={{}}
              />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="Block p-3">
              <div className="Block-header">Upcoming Events</div>
              <div className="Block-subtitle">Select an event to register.</div>
              {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                <Event
                  key={month}
                  month={month}
                  events={monthEvents}
                  onEventClick={handleEventClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardDashboard;
