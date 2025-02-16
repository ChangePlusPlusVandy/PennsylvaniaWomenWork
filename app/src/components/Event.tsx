import React from 'react';
import '../styles/_mentee.scss';

export interface EventData {
  id: number;
  day: string;
  date: string;
  month: string;
  title: string;
  description: string;
  fullDescription: string;
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
        {events.map((event) => (
          <div
            className="Event-item"
            key={event.id}
            onClick={() => onEventClick(event)}
          >
            <div className="Flex-column--centered Margin-right--30">
              <div>{event.day}</div>
              <div className="Text-fontSize--30">{event.date}</div>
            </div>
            <div className="Flex-column Text-bold">
              <span className="Margin-bottom--4">{event.title}</span>
              <div className="Text-fontSize--14">
                {event.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

export default Event;