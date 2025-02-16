import React, { type ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import MentorDashboard from "./pages/MentorDashboard";
import MenteeDashboard from "./pages/MenteeDashboard";
import ConfirmLogout from "./pages/ConfirmLogout";
import CreateWorkshop from "./pages/CreateWorkshop";
import CreateMeeting from "./pages/CreateMeeting";
import MenteeInformation from "./pages/MenteeInformation";
import WorkshopInformation from "./pages/WorkshopInformation";
import MenteeCourseInformation from "./pages/MenteeCourseInformation";
import AuthCallback from "./pages/auth-callback";
import LoginRedirect from "./pages/LoginRedirect";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import SampleMenteeInvite from "./pages/MenteeInvite";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./components/ProtectedRoute";
import { tier1Roles, tier2Roles, tier3Roles } from "./utils/roles";
import { UserProvider, useUser } from "./contexts/UserContext";

function App(): ReactElement {
  const { isAuthenticated, user: Auth0User } = useAuth0();
  const { user } = useUser();

  return (
    <div className="App">
      <Routes>
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/logout" element={<Logout />} />
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/" element={<LoginRedirect />} />
            <Route path="*" element={<LoginRedirect />} />
          </>
        ) : (
          <>
            <Route
              path="/mentor"
              element={
                <ProtectedRoute
                  element={<MentorDashboard />}
                  allowedRoles={[...tier1Roles, ...tier2Roles]}
                />
              }
            />

            {user?.role === "mentee" ? (
              <Route
                path="/home"
                element={
                  <ProtectedRoute
                    element={<MenteeDashboard />}
                    allowedRoles={[...tier1Roles, ...tier3Roles]}
                  />
                }
              />
            ) : (
              <Route
                path="/home"
                element={
                  <ProtectedRoute
                    element={<MentorDashboard />}
                    allowedRoles={[...tier1Roles, ...tier2Roles]}
                  />
                }
              />
            )}

            <Route
              path="/mentee"
              element={
                <ProtectedRoute
                  element={<MenteeDashboard />}
                  allowedRoles={[...tier1Roles, ...tier3Roles]}
                />
              }
            />
            <Route path="/mentee/course-information"
              element={
                <ProtectedRoute
                  element={<MenteeCourseInformation />}
                  allowedRoles={["mentee", "admin"]}
                />
              }
            />
            <Route path="/confirmLogout" element={<ConfirmLogout />} />
            <Route
              path="/create-workshop"
              element={
                <ProtectedRoute
                  element={<CreateWorkshop />}
                  allowedRoles={[...tier1Roles, ...tier2Roles]}
                />
              }
            />
            <Route
              path="/create-meeting"
              element={
                <ProtectedRoute
                  element={<CreateMeeting />}
                  allowedRoles={[...tier1Roles, ...tier2Roles]}
                />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/mentor/mentee-information"
              element={
                <ProtectedRoute
                  element={<MenteeInformation />}
                  allowedRoles={[...tier1Roles, ...tier2Roles]}
                />
              }
            />
            <Route
              path="/mentor/workshop-information"
              element={
                <ProtectedRoute
                  element={<WorkshopInformation />}
                  allowedRoles={[...tier1Roles, ...tier2Roles]}
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

          </>
        )}
      </Routes>
    </div>
  );
}
export default App;
