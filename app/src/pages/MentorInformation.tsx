import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import { api } from "../api";

interface Mentee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Mentor {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  mentees: Mentee[];
}

const VolunteerInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mentorId = location.state?.volunteerId; // assuming volunteerId is really mentorId now
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId) {
      setError("Mentor ID is missing.");
      setLoading(false);
      return;
    }

    const fetchMentorData = async () => {
      try {
        const response = await api.get(`/api/mentor/get-mentor/${mentorId}`);
        setMentor(response.data);
        console.log("Mentor data:", response.data);
      } catch (err) {
        setError("Failed to load mentor details.");
        console.error("Error fetching mentor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [mentorId]);

  const getInitials = () => {
    if (!mentor) return "";
    return (
      mentor.first_name.charAt(0).toUpperCase() +
      mentor.last_name.charAt(0).toUpperCase()
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div
            className="col-lg-12 mb-4"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <Icon glyph="chevron-left" className="Text-colorHover--teal-1000" />
          </div>

          {/* Column 1: Mentor Info */}
          <div className="col-lg-4 mb-4">
            <div className="Block">
              <div className="Block-header">Mentor Information</div>
              <div className="Block-subtitle">Mentor Details</div>
              <div className="Block-content">
                <div className="Profile-avatar">
                  <div className="Profile-initials">{getInitials()}</div>
                </div>
                <div className="Profile-field">
                  <div className="Profile-field-label">Name:</div>
                  <div>
                    {mentor?.first_name} {mentor?.last_name}
                  </div>
                </div>
                <div className="Profile-field">
                  <div className="Profile-field-label">Role:</div>
                  <div>{mentor?.role}</div>
                </div>
                <div className="Profile-field">
                  <div className="Profile-field-label">Email:</div>
                  <div>{mentor?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Assigned Mentees */}
          <div className="col-lg-4 mb-4">
            <div className="Block">
              <div className="Block-header">Assigned Mentees</div>
              <div className="Block-subtitle">
                Mentees working with {mentor?.first_name}
              </div>
              {(mentor?.mentees ?? []).length > 0 ? (
                <div className="Flex-col">
                  {mentor?.mentees.map((mentee) => (
                    <div key={mentee._id} className="Profile-field">
                      {mentee.first_name} {mentee.last_name}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No mentees assigned.</p>
              )}
            </div>
          </div>

          {/* Column 3: Upcoming Meetings (Placeholder) */}
          <div className="col-lg-4 mb-4">
            <div className="Block">
              <div className="Block-header">Upcoming Meetings</div>
              <div className="Block-subtitle">
                Meetings with {mentor?.first_name}
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="me-3 text-center" style={{ width: "40px" }}>
                  <div className="text-muted">Wed</div>
                  <div style={{ fontSize: "1.5rem", color: "#343a40" }}>25</div>
                </div>
                <div>
                  <div>Mock Interview Session</div>
                  <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Practice your interview skills with a professional.
                  </div>
                </div>
              </div>
              <button
                className="Button Button-color--blue-1000 Width--100"
                onClick={() => navigate("/create-meeting")}
              >
                Add New Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolunteerInformation;
