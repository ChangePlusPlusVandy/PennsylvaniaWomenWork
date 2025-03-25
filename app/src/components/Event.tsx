import React from "react";

export interface EventData {
  userIds: string[];
  //day: string
  date: string;
  //month: string
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
    <div key={month} style={{ marginBottom: "20px" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {month}
      </h3>
      {events.map((event) => {
        const eventDate = new Date(event.date);
        const dayOfMonth = eventDate.getDate();
        const dayOfWeek = eventDate.toLocaleDateString("en-US", {
          weekday: "short",
        });

        return (
          <div
            key={event.name}
            onClick={() => onEventClick(event)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid var(--pww-color-gray-200)",
              background: "var(--pww-color-gray-50)",
              borderRadius: "5px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "60px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "var(--pww-color-dark-1000)",
                }}
              >
                {dayOfMonth}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--pww-color-gray-1000)",
                  textTransform: "uppercase",
                }}
              >
                {dayOfWeek}
              </div>
            </div>
            <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                {event.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
