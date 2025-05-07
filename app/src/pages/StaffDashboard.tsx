import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useUser } from "../contexts/UserContext";
import { User as AppUser } from "../contexts/UserContext";
import { api } from "../api";
import ParticipantCard from "../components/ParticipantCard";
import FolderCard from "../components/FolderCard";
import { toast } from "react-hot-toast";
import Event, {
  EventData,
  parseEvents,
  groupEventsByMonth,
  formatEventSubheader,
} from "../components/Event";
import { Formik, Form, Field } from "formik";
import TagDropdown from "../components/MultiSelectDropdown";
import FolderUI from "../components/FolderUI";
import PeopleGrid from "../components/PeopleGrid";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

// interface User {
//   _id: string
//   first_name: string
//   last_name: string
//   email: string
// }

interface CourseInformationElements {
  _id: string;
  name: string;
  description: string;
  s3id: string;
  createdAt: string;
  mentor: string;
  mentee: string;
  coverImageS3id: string;
  tags: string[];
}

type ImageUrlMap = Record<string, string | null>;

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState<User[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [boardMembers, setBoardMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const { user } = useUser();
  const [workshops, setWorkshops] = useState<CourseInformationElements[]>([]);
  const userId = user?._id;
  const [imageUrls, setImageUrls] = useState<ImageUrlMap>({});
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "My Mentees";
  });
  const [workshopTags, setWorkshopTags] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchUserEvents = async () => {
      try {
        const response = await api.get(`/api/event/${userId}`);
        const parsed = parseEvents(response.data);
        setEvents(parsed);
        console.log("Fetched events:", parsed);
      } catch (err) {
        console.log("Failed to load events.");
      }
    };

    if (
      !userId ||
      (user.role !== "mentor" && user.role !== "staff" && user.role !== "board")
    ) {
      console.log("Only mentors can view mentees.");
      setLoading(false);
      return;
    }

    const fetchMentees = async () => {
      try {
        const endpoint =
          user.role === "staff"
            ? "/api/mentee/all-mentees"
            : `/api/mentor/${user._id}/mentees`;

        const response = await api.get(endpoint);

        const menteeData =
          user.role === "staff"
            ? response.data // getAllMentees returns array directly
            : response.data.mentees; // getMenteesForMentor returns {mentees: [...]}

        setMentees(Array.isArray(menteeData) ? menteeData : []);
        console.log("menteeData", menteeData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchUserEvents();
    fetchMentees();
  }, [user, userId]);

  // call endpoint to get all workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await api.get(`/api/workshop/get-workshops`);
        setWorkshops(response.data);
        fetchImageUrls(response.data);
      } catch (err) {
        console.log("Unable to fetch folders.");
      }
    };
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      if (user?.role === "staff" || user?.role === "board") {
        try {
          const response = await api.get(`/api/mentor/all-mentors`);
          setMentors(response.data);
        } catch (err) {
          console.error("Unable to fetch mentors.");
        }
      }
    };

    fetchMentors();
  }, [user]);

  useEffect(() => {
    const fetchStaffAndBoard = async () => {
      try {
        const staffResponse = await api.get("/api/user/all-staff");
        setStaffMembers(staffResponse.data);
        const boardResponse = await api.get("/api/user/all-board");
        setBoardMembers(boardResponse.data);
      } catch (err) {
        console.error("Error fetching staff or board members:", err);
      }
    };

    if (user?.role === "staff" || user?.role === "board") {
      fetchStaffAndBoard();
    }
  }, [user]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchImageUrls = async (workshopsData: any) => {
    const urls: ImageUrlMap = {};

    await Promise.all(
      workshopsData.map(async (item: any) => {
        if (item.coverImageS3id) {
          try {
            const res = await api.get(
              `/api/resource/getURL/${item.coverImageS3id}`,
            );
            urls[item.coverImageS3id] = res.data.signedUrl;
          } catch (error) {
            console.error(
              `Error fetching image for ${item.coverImageS3id}:`,
              error,
            );
            urls[item.coverImageS3id] = null;
          }
        }
      }),
    );

    setImageUrls(urls);
  };

  const eventsByMonth = groupEventsByMonth(events);

  const monthsWithEvents = Object.entries(eventsByMonth).filter(
    ([_, events]) => events.length > 0,
  );

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (!storedTab) {
      if (user?.role === "board") {
        handleTabClick("Folders");
      } else if (user?.role === "mentor" || user?.role === "staff") {
        handleTabClick("My Participants");
      }
    }
  }, [user?.role]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await api.delete(`/api/event/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  useEffect(() => {
    const fetchWorkshopTags = async () => {
      try {
        const response = await api.get("/api/workshop/get-tags");
        setWorkshopTags(response.data);
      } catch (error) {
        console.error("Error fetching workshop tags:", error);
      }
    };

    fetchWorkshopTags();
  }, []);

  return (
    <>
      <Navbar />
      {selectedEvent && (
        <Modal
          header={selectedEvent.name}
          subheader={selectedEvent ? formatEventSubheader(selectedEvent) : ""}
          body={
            <div className="Flex-column">
              {selectedEvent.description}
              <div
                className="Button Button-color--red-1000 Margin-top--10 Button--hollow"
                onClick={() => handleDeleteEvent(selectedEvent._id)}
              >
                Delete Event
              </div>
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
              <div className="Block-header">
                <div className="Flex-row">
                  {[
                    "Folders",
                    ...(user?.role === "staff"
                      ? [
                          "My Participants",
                          "Volunteers",
                          "Staff Members",
                          "Board Members",
                        ]
                      : []),
                    ...(user?.role === "mentor" ? ["My Participants"] : []),
                  ].map((tab) => (
                    <div
                      key={tab}
                      onClick={() => handleTabClick(tab)}
                      className={`tab ${activeTab === tab ? "active" : ""}`}
                    >
                      {tab === "My Participants" && user?.role === "staff"
                        ? "Participants"
                        : tab}
                    </div>
                  ))}
                </div>
              </div>
              <div className="Block-subtitle" />

              {activeTab === "My Participants" && (
                <PeopleGrid users={mentees} />
              )}

              {(user?.role === "staff" || user?.role === "board") &&
                activeTab === "Volunteers" && <PeopleGrid users={mentors} />}

              {activeTab === "Staff Members" && (
                <PeopleGrid users={staffMembers} />
              )}

              {activeTab === "Board Members" && (
                <PeopleGrid users={boardMembers} />
              )}

              {activeTab === "Folders" && (
                <div>
                  <FolderUI
                    folders={workshops}
                    allTags={workshopTags}
                    imageUrls={imageUrls}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="Block p-3">
              <div className="Block-header">Upcoming Events</div>
              <div className="Block-subtitle">Select an event for details.</div>
              {monthsWithEvents.length === 0 ? (
                <div className="Text--center">No upcoming events</div>
              ) : (
                monthsWithEvents.map(([month, monthEvents]) => (
                  <Event
                    key={month}
                    month={month}
                    events={monthEvents}
                    onEventClick={handleEventClick}
                  />
                ))
              )}

              <div
                className="Flex-row Align-items--center Width--100 Margin-top--10"
                style={{ gap: "10px" }}
              >
                {user && user.role === "staff" && (
                  <div
                    className="Button Button-color--blue-1000"
                    onClick={() => {
                      navigate("/create-event");
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    Add New Event
                  </div>
                )}

                {user && (user.role === "staff" || user.role === "mentor") && (
                  <div
                    className="Button Button-color--blue-1000 "
                    onClick={() => navigate("/create-meeting")}
                    style={{ flexGrow: 1 }}
                  >
                    Schedule Meeting
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
