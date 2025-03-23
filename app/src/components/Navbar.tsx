import React, { type ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext";
import { tier1Roles, tier2Roles, tier3Roles } from "../utils/roles";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth0();
  const { user } = useUser();

  // Determine correct dashboard path for "Home"
  const getHomePath = () => {
    if (!user) return "/home";
    switch (user.role) {
      case "mentor":
        return "/mentor";
      case "mentee":
        return "/mentee";
      case "staff":
      case "board":
        return "/home"; // StaffBoardDashboard is mapped to /home
      default:
        return "/home";
    }
  };

  const navItems = [
    {
      path: getHomePath(),
      label: "Home",
      roles: ["mentor", "mentee", "staff", "board"], // All roles
    },
    {
      path: "/create-workshop",
      label: "Create Workshop",
      roles: [...tier1Roles, ...tier2Roles],
    },
    {
      path: "/create-meeting",
      label: "Create Meeting",
      roles: [...tier1Roles, ...tier2Roles],
    },
    {
      path: "/profile",
      label: "Profile",
      roles: [...tier1Roles, ...tier2Roles, ...tier3Roles],
    },
    {
      path: "/invite",
      label: "Invite Mentee",
      roles: [...tier1Roles],
    },
    {
      path: "/create-event",
      label: "Create Event",
      roles: [...tier1Roles], // Only board + staff
    },
  ];

  return (
      <div className="Navbar">
        <div className="Navbar-body">
          {/* Logo click = go to correct dashboard */}
          <div
              className="Navbar-body-logo"
              onClick={() => navigate(getHomePath())}
          />

          <div className="Navbar-left">
            {/* Show links user has permission for */}
            {navItems
                .filter((item) => user && item.roles.includes(user.role))
                .map((tab) => (
                    <div
                        key={tab.path}
                        className={`Navbar-body-link ${
                            location.pathname === tab.path ? "Navbar-active" : ""
                        }`}
                        onClick={() => navigate(tab.path)}
                    >
                      {tab.label}
                    </div>
                ))}

            {!isAuthenticated ? (
                <div className="Flex-row">
                  <div
                      className="Button Button-color--teal-1000 Margin-right--20"
                      onClick={() => navigate("/")}
                  >
                    Log In
                  </div>
                  <div
                      className="Button Button-color--teal-1000"
                      onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </div>
                </div>
            ) : (
                <div
                    className="Button Button-color--teal-1000"
                    onClick={() => {
                      logout();
                    }}
                >
                  Log Out
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Navbar;
