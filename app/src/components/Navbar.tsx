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

  const navItems = [
    { path: "/mentor", label: "Home", roles: [...tier1Roles, ...tier2Roles] },
    { path: "/mentee", label: "Home", roles: [...tier3Roles] },
    {
      path: "/create-workshop",
      label: "Create Workshop",
      roles: [...tier1Roles],
    },
    {
      path: "/create-meeting",
      label: "Create Meeting",
      roles: [...tier1Roles],
    },
    {
      path: "/invite",
      label: "Invite User",
      roles: [...tier1Roles],
    },
    {
      path: "/profile",
      label: "Profile",
      roles: [...tier1Roles, ...tier2Roles, ...tier3Roles],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;

    // Special case: only show the correct Home tab
    if (item.label === "Home") {
      if (item.path === "/mentor") {
        return user.role === "mentor" || tier1Roles.includes(user.role);
      }
      if (item.path === "/mentee") {
        return user.role === "mentee";
      }
      return false;
    }

    // For all other tabs, use standard RBAC
    return item.roles.includes(user.role);
  });

  return (
    <div className="Navbar">
      <div className="Navbar-body">
        <div
          className="Navbar-body-logo"
          onClick={() => navigate("/home")}
        ></div>

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
              onClick={() => {
                logout({
                  async openUrl() {
                    await navigate("/logout");
                  },
                });
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
