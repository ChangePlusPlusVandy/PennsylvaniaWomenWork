import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Event, { EventData } from "../components/Event";
import { useUser } from "../contexts/UserContext";
import { api } from "../api";

const StaffBoardDashboard = () => {
    const { user } = useUser();
    const [events, setEvents] = useState<EventData[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    useEffect(() => {
        if (!user?._id) return;

        const fetchEvents = async () => {
            try {
                const response = await api.get(`/api/event/${user._id}`);
                setEvents(
                    response.data.map((event: any) => ({
                        name: event.name,
                        description: event.description,
                        date: event.date,
                        userIds: event.users || [],
                        calendarLink: event.calendarLink || "",
                    }))
                );
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, [user]);

    const eventsByMonth: { [key: string]: EventData[] } = events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .reduce((acc, event) => {
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
        }, {} as { [key: string]: EventData[] });

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
            <div className="Block p-3 Margin--20">
                <div className="Block-header">Your Events</div>
                <div className="Block-subtitle">Events linked to your account</div>
                {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                    <Event
                        key={month}
                        month={month}
                        events={monthEvents}
                        onEventClick={setSelectedEvent}
                    />
                ))}
            </div>
        </>
    );
};

export default StaffBoardDashboard;
