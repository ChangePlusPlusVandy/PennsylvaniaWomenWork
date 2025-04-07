import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Event, { EventData } from "../components/Event";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

interface File {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  s3id: string;
}

const BoardDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const { user } = useUser();
  const userId = user?._id;
  const [loading, setLoading] = useState(true);
  const start = selectedEvent ? new Date(selectedEvent.startTime) : null;
  const end = selectedEvent ? new Date(selectedEvent.endTime) : null;
  const eventDate = selectedEvent ? new Date(selectedEvent.date) : null;

  const formattedSubheader =
    eventDate && start && end
      ? `${eventDate.toLocaleString("default", {
          month: "long",
        })} ${eventDate.getDate()}, ${eventDate.getFullYear()} ${start.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          },
        )} - ${end.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`
      : "";

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [eventsResponse, filesResponse] = await Promise.all([
          api.get(`/api/event/${userId}`),
          api.get(`/api/boardFile/get-board-files`),
        ]);

        setFiles(
          filesResponse.data.map((file: any) => ({
            name: file.name,
            description: file.description,
            s3id: file.s3id,
            tags: file.tags || [],
          })),
        );

        setEvents(
          eventsResponse.data.map((event: any) => ({
            name: event.name,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            date: event.date,
            userIds: event.users || [],
            calendarLink: event.calendarLink || "",
          })),
        );

        setEvents(eventsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFileClick = async (fileId: string) => {
    try {
      console.log("File ID:", fileId); // Log the file ID for debugging
      const signedUrl = await getFileLink(fileId);
      if (signedUrl) {
        window.open(signedUrl, "_blank"); // opens the file in a new tab
      } else {
        console.error("Failed to retrieve signed URL.");
      }
    } catch (error) {
      console.error("Error fetching file link:", error);
    }

    // navigate(`/volunteer/workshop-information`, {
    //   state: { workshopId },
    // });
  };

  const getFileLink = async (fileId: string) => {
    try {
      const { data } = await api.get(`/api/resource/getURL/${fileId}`);
      return data.signedUrl;
    } catch (error) {
      console.error("Error fetching file link:", error);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventsByMonth: { [key: string]: EventData[] } = events
    .filter((event) => new Date(event.date) >= today)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    ) // Sort events chronologically
    .reduce(
      (acc, event) => {
        const eventDate = new Date(event.startTime);
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
                  Add to Calendar
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
              <div className="row gx-3 gy-3">
                {files.map((item) => (
                  <div
                    className="col-lg-4"
                    key={item.s3id}
                    onClick={() => handleFileClick(item.s3id)}
                  >
                    <div className="Mentor--card">
                      <div className="Mentor--card-color Background-color--teal-1000">
                        <div className="File-tags-container">
                          <div className="File-tags">
                            {item.tags.map((tag, index) => (
                              <span key={index} className="Tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="Padding--10">
                        <div className="Mentor--card-name">{item.name}</div>
                        <div className="Mentor--card-description">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
