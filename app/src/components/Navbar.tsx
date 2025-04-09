import React, { type ReactElement } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../contexts/UserContext";
import { roles } from "../utils/roles";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth0();
  const { user } = useUser();

  const navItems = [
    {
      path: "/mentor",
      label: "Home",
      roles: [roles.staff, roles.volunteer, roles.board],
    },
    { path: "/mentee", label: "Home", roles: [roles.participant] },
    {
      path: "/create-workshop",
      label: "Create Folder",
      roles: [roles.staff, roles.board],
    },
    {
      path: "/create-meeting",
      label: "Create Meeting",
      roles: [roles.staff, roles.volunteer],
    },
    { path: "/create-event", label: "Create Event", roles: [roles.staff] },
    {
      path: "/invite",
      label: "Invite User",
      roles: [roles.staff],
    },
    {
      path: "/profile",
      label: "Profile",
      roles: [roles.staff, roles.volunteer, roles.participant, roles.board],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;

    // Handle "Home" tab logic separately
    if (item.label === "Home") {
      if (item.path === "/mentor") {
        return [roles.staff, roles.volunteer, roles.board].includes(user.role);
      }
      if (item.path === "/mentee") {
        return user.role === roles.participant;
      }
      return false;
    }

    return item.roles.includes(user.role);
  });

  return (
    <div className="Navbar">
      <div className="Navbar-body">
        <div className="Navbar-body-logo" onClick={() => navigate("/home")} />

        <div className="Navbar-left">
          {filteredNavItems.map((tab) => (
            <div
              key={tab.path}
              className={`Navbar-body-link ${location.pathname === tab.path ? "Navbar-active" : ""}`}
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
              onClick={() =>
                logout({
                  logoutParams: {
                    returnTo: window.location.origin + "/logout",
                  },
                })
              }
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
