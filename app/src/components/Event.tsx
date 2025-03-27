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
    <div key={month} style={{ marginBottom: "20px" }}>
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginTop: "25px",
          marginBottom: "10px",
        }}
      >
        {month}
      </h3>
      <div
        style={{
          height: "1px",
          width: "60%",
          backgroundColor: "var(--pww-color-gray-300)",
          marginBottom: "15px",
        }}
      />
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
              padding: "8px",
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
              <div
                style={{ fontSize: "30px", color: "var(--pww-color-gray-800)" }}
              >
                {dayOfMonth}
              </div>
            </div>
            <div style={{ flexGrow: 1, paddingLeft: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "var(--pww-color-gray-1000)",
                  }}
                >
                  {event.name}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--pww-color-gray-800)",
                    marginTop: "2px",
                  }}
                >
                  {event.description}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Event;
