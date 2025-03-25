import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Event, { EventData } from "../components/Event";
import { useUser } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

interface CourseInformationElements {
  id: string;
  courseName: string;
}

const MenteeDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const { user } = useUser();
  const userId = user?._id;

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
            name: event.name,
            description: event.description,
            date: event.date,
            userIds: event.users || [],
            calendarLink: event.calendarLink || "",
          })),
        );

        setWorkshops(
          workshopsResponse.data.map((workshop: any) => {
            console.log("Workshop loaded:", workshop);
            return {
              id: workshop._id,
              courseName: workshop.name,
            };
          }),
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleClick = (id: string) => {
    navigate(`/mentee/course-information/${id}`);
  };

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
      <div className="row g-3 Margin--20">
        <div className="col-lg-8">
          <div className="Block p-3">
            <div className="Block-header">My Courses</div>
            <div className="Block-subtitle">
              Select a course to access materials.
            </div>
            <div className="row gx-3 gy-3">
              {workshops.map((item) => (
                <div className="col-lg-4" key={item.id}>
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
