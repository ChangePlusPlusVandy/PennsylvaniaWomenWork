import React from "react";

export interface EventData {
  _id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  expirationDate?: string;
  calendarLink?: string;
  userIds?: string[];
  formattedDate?: string;
}

interface EventProps {
  month: string;
  events: EventData[];
  onEventClick?: (event: EventData) => void;
}

const Event = ({ month, events, onEventClick }: EventProps) => {
  return (
    <div className="Event">
      <div className="Event-month">{month}</div>

      {events.map((event) => {
        const eventDate = new Date(event.date);
        const dayOfMonth = eventDate.getDate();
        const dayOfWeek = eventDate.toLocaleDateString("en-US", {
          weekday: "short",
        });

        const isExpirationEvent = !!event.expirationDate;

        let timeRange = "";
        if (!isExpirationEvent) {
          const formattedStart = new Date(event.startTime).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true },
          );
          const formattedEnd = new Date(event.endTime).toLocaleTimeString(
            "en-US",
            { hour: "2-digit", minute: "2-digit", hour12: true },
          );
          timeRange = `${formattedStart} – ${formattedEnd}`;
        }

        return (
          <div
            key={event._id}
            className="Event-item"
            onClick={() => onEventClick && onEventClick(event)}
          >
            <div className="Event-item-date">
              <div className="day">{dayOfMonth}</div>
              <div className="weekday">{dayOfWeek}</div>
            </div>
            <div className="Event-item-details">
              <div className="title">{event.name}</div>
              <div className="time">
                {isExpirationEvent ? "Expires on this date" : timeRange}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;

export const parseEvents = (rawEvents: any[]): EventData[] => {
  return rawEvents.map(
    (event: any): EventData => ({
      _id: event._id || `${event.name}-${event.date}`,
      name: event.name,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      date: event.date,
      expirationDate: event.expirationDate,
      userIds: event.users || [],
      calendarLink: event.calendarLink || "",
    }),
  );
};

export const groupEventsByMonth = (events: EventData[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter((event) => new Date(event.date) >= today)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .reduce(
      (acc, event) => {
        const eventDate = new Date(event.startTime);
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
};

export const formatEventSubheader = (event: EventData): string => {
  const date = new Date(event.date);
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);

  if (event.expirationDate) {
    const expiration = new Date(event.expirationDate);
    return `Expires on ${expiration.toDateString()}`;
  }

  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()} ${start.toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit", hour12: true },
  )} - ${end.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};
