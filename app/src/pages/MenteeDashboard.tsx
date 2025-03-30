import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Event, { EventData } from "../components/Event";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

interface Workshop {
  _id: string;
  name: string;
  description: string;
}

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const { user } = useUser();
  const userId = user?._id;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [eventsResponse, workshopsResponse] = await Promise.all([
          api.get(`/api/event/${userId}`),
          api.get(`/api/mentee/${userId}/workshops`),
        ]);

        setEvents(
          eventsResponse.data.map((event: any) => ({
            id: event._id,
            title: event.name,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            date: event.date,
            calendarLink: event.calendarLink,
          })),
        );

        setWorkshops(workshopsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleWorkshopClick = (workshopId: string) => {
    navigate(`/mentor/workshop-information`, {
      state: { workshopId },
    });
  };

  const eventsByMonth: { [key: string]: EventData[] } = events
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
          subheader={`${new Date(selectedEvent.date).toLocaleString("default", { month: "long" })} ${new Date(selectedEvent.date).getDate()}, ${new Date(selectedEvent.date).getFullYear()} ${new Date(selectedEvent.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })} - ${new Date(selectedEvent.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`}
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
      <div className="row g-3 Margin--20">
        <div className="col-lg-8">
          <div className="Block p-3">
            <div className="Block-header">My Courses</div>
            <div className="Block-subtitle">
              Select a course to access materials.
            </div>
            <div className="row gx-3 gy-3">
              {workshops.map((item) => (
                <div className="col-lg-4" key={item._id}>
                  <div
                    className="Workshop-card"
                    onClick={() => handleWorkshopClick(item._id)}
                  >
                    <div className="Workshop-card-color Background-color--teal-1000" />
                    <div className="Padding--10">
                      <h3 className="Text-fontSize--20 Text-color--gray-600">
                        {item.name}
                      </h3>
                      <p className="Text-color--gray-400">{item.description}</p>
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
    </>
  );
};

export default MenteeDashboard;
