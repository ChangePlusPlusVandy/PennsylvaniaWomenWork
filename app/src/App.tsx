import React, { type ReactElement } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MentorDashboard from "./pages/MentorDashboard";
import MenteeDashboard from "./pages/MenteeDashboard";
import ConfirmLogout from "./pages/ConfirmLogout";
import CreateWorkshop from "./pages/CreateWorkshop";
import CreateMeeting from "./pages/CreateMeeting";
import MenteeInformation from "./pages/MenteeInformation";
import WorkshopInformation from "./pages/WorkshopInformation";
import AuthCallback from "./pages/auth-callback";
import LoginRedirect from "./pages/LoginRedirect";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import SampleMenteeInvite from "./pages/MenteeInvite";
import ProtectedRoute from "./components/ProtectedRoute";
import BoardDashboard from "./pages/BoardDashboard";
import VolunteerInformation from "./pages/MentorInformation";
import { tier1Roles, tier2Roles, tier3Roles } from "./utils/roles";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "./contexts/UserContext";

function App(): ReactElement {
  const { isAuthenticated } = useAuth0();
  const { user } = useUser();

  if (!isAuthenticated) {
    // Unauthenticated users are directed to the login flow
    return (
      <Routes>
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/" element={<LoginRedirect />} />
        <Route path="*" element={<LoginRedirect />} />
      </Routes>
    );
  }

  // Authenticated routes are wrapped with ProtectedRoute using RBAC
  return (
    <Routes>
      {/* Fallback: any unmatched route redirects to /home */}
      <Route path="*" element={<Navigate to="/home" replace />} />
      <Route path="/callback" element={<AuthCallback />} />
      <Route path="/logout" element={<Logout />} />
      {/* Home route: different dashboards based on user role */}
      <Route
        path="/home"
        element={
          user?.role === "mentee" ? (
            <ProtectedRoute
              element={<MenteeDashboard />}
              allowedRoles={[...tier1Roles, ...tier3Roles]}
            />
          ) : user?.role === "board" ? (
            <ProtectedRoute
              element={<BoardDashboard />}
              allowedRoles={[...tier1Roles]}
            />
          ) : (
            <ProtectedRoute
              element={<MentorDashboard />}
              allowedRoles={[...tier1Roles, ...tier2Roles]}
            />
          )
        }
      />
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute
            element={<MentorDashboard />}
            allowedRoles={[...tier1Roles, ...tier2Roles]}
          />
        }
      />
      `{" "}
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute
            element={<MentorDashboard />}
            allowedRoles={[...tier1Roles, ...tier2Roles]}
          />
        }
      />
      <Route path="/confirmLogout" element={<ConfirmLogout />} />
      <Route
        path="/create-workshop"
        element={
          <ProtectedRoute
            element={<CreateWorkshop />}
            allowedRoles={[...tier1Roles]}
          />
        }
      />
      <Route
        path="/create-meeting"
        element={
          <ProtectedRoute
            element={<CreateMeeting />}
            allowedRoles={[...tier1Roles, ...tier2Roles, ...tier3Roles]}
          />
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="/volunteer/participant-information"
        element={
          <ProtectedRoute
            element={<MenteeInformation />}
            allowedRoles={[...tier1Roles, ...tier2Roles]}
          />
        }
      />
      <Route
        path="/particpant/participant-information"
        element={
          <ProtectedRoute
            element={<VolunteerInformation />}
            allowedRoles={tier1Roles}
          />
        }
      />
      <Route
        path="/volunteer/workshop-information"
        element={
          <ProtectedRoute
            element={<WorkshopInformation />}
            allowedRoles={[...tier1Roles, ...tier2Roles, ...tier3Roles]}
          />
        }
      />
      <Route
        path="/invite"
        element={
          <ProtectedRoute
            element={<SampleMenteeInvite />}
            allowedRoles={[...tier1Roles]}
          />
        }
      />
    </Routes>
  );
}

export default App;
