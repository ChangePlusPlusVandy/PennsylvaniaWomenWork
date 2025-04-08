import React, { type ReactElement } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import StaffDashboard from "./pages/StaffDashboard"
import MenteeDashboard from "./pages/MenteeDashboard"
import ConfirmLogout from "./pages/ConfirmLogout"
import CreateWorkshop from "./pages/CreateWorkshop"
import CreateMeeting from "./pages/CreateMeeting"
import CreateEvent from "./pages/CreateEvent"
import MenteeInformation from "./pages/MenteeInformation"
import WorkshopInformation from "./pages/WorkshopInformation"
import AuthCallback from "./pages/auth-callback"
import LoginRedirect from "./pages/LoginRedirect"
import Logout from "./pages/Logout"
import Profile from "./pages/Profile"
import SampleMenteeInvite from "./pages/MenteeInvite"
import ProtectedRoute from "./components/ProtectedRoute"
import BoardDashboard from "./pages/BoardDashboard"
import VolunteerInformation from "./pages/MentorInformation"
import { useAuth0 } from "@auth0/auth0-react"
import { useUser } from "./contexts/UserContext"
import { roles } from "./utils/roles"

function App(): ReactElement {
  const { isAuthenticated } = useAuth0()
  const { user } = useUser()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/callback" element={<AuthCallback />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/" element={<LoginRedirect />} />
        <Route path="*" element={<LoginRedirect />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/home" replace />} />
      <Route path="/callback" element={<AuthCallback />} />
      <Route path="/logout" element={<Logout />} />

      <Route
        path="/home"
        element={
          user?.role === "mentee" ? (
            <ProtectedRoute
              element={<MenteeDashboard />}
              allowedRoles={[roles.volunteer, roles.participant]}
            />
          ) : user?.role === "board" ? (
            <ProtectedRoute
              element={<BoardDashboard />}
              allowedRoles={[roles.board]}
            />
          ) : (
            <ProtectedRoute
              element={<StaffDashboard />}
              allowedRoles={[roles.volunteer, roles.staff]}
            />
          )
        }
      />

      <Route
        path="/volunteer"
        element={
          <ProtectedRoute
            element={<StaffDashboard />}
            allowedRoles={[roles.staff]}
          />
        }
      />

      <Route path="/confirmLogout" element={<ConfirmLogout />} />

      <Route
        path="/create-workshop"
        element={
          <ProtectedRoute
            element={<CreateWorkshop />}
            allowedRoles={[roles.staff, roles.board]}
          />
        }
      />

      <Route
        path="/create-meeting"
        element={
          <ProtectedRoute
            element={<CreateMeeting />}
            allowedRoles={[
              roles.volunteer,
              roles.staff,
              roles.board,
              roles.participant,
            ]}
          />
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute
            element={<CreateEvent />}
            allowedRoles={[roles.staff, roles.board]}
          />
        }
      />

      <Route path="/profile" element={<Profile />} />

      <Route
        path="/volunteer/participant-information"
        element={
          <ProtectedRoute
            element={<MenteeInformation />}
            allowedRoles={[roles.volunteer, roles.staff]}
          />
        }
      />

      <Route
        path="/volunteer/volunteer-information"
        element={
          <ProtectedRoute
            element={<VolunteerInformation />}
            allowedRoles={[roles.staff, roles.board]}
          />
        }
      />

      <Route
        path="/volunteer/workshop-information"
        element={
          <ProtectedRoute
            element={<WorkshopInformation />}
            allowedRoles={[
              roles.volunteer,
              roles.staff,
              roles.participant,
              roles.board,
            ]}
          />
        }
      />

      <Route
        path="/invite"
        element={
          <ProtectedRoute
            element={<SampleMenteeInvite />}
            allowedRoles={[roles.staff, roles.board]}
          />
        }
      />
    </Routes>
  )
}

export default App
