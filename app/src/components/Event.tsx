import React from "react";

export interface EventData {
  userIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  description: string;
  formattedDate?: string;
  calendarLink?: string;
}

interface EventProps {
  month: string;
  events: EventData[];
  onEventClick: (event: EventData) => void;
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

        const formattedStart = new Date(event.startTime).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit", hour12: true },
        );
        const formattedEnd = new Date(event.endTime).toLocaleTimeString(
          "en-US",
          { hour: "2-digit", minute: "2-digit", hour12: true },
        );
        const timeRange = `${formattedStart} – ${formattedEnd}`;

        return (
          <div
            key={event.name + event.date}
            className="Event-item"
            onClick={() => onEventClick(event)}
          >
            <div className="Event-item-date">
              <div className="day">{dayOfMonth}</div>
              <div className="weekday">{dayOfWeek}</div>
            </div>
            <div className="Event-item-details">
              <div className="title">{event.name}</div>
              {/* <div className="desc">{event.description}</div> */}
              <div className="time">{timeRange}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
