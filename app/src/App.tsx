import React, { type ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MentorDashboard from "./pages/MentorDashboard";
import MenteeDashboard from "./pages/MenteeDashboard";
import ConfirmLogout from "./pages/ConfirmLogout";
import CreateWorkshop from "./pages/CreateWorkshop";
import CreateMeeting from "./pages/CreateMeeting";
import MenteeInformation from "./pages/MenteeInformation";
import AuthCallback from "./pages/auth-callback";
import LoginRedirect from "./pages/LoginRedirect";

function App(): ReactElement {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mentor" element={<MentorDashboard />} />
        <Route path="/mentee" element={<MenteeDashboard />} />
        <Route path="/confirmLogout" element={<ConfirmLogout />} />
        <Route path="/create-workshop" element={<CreateWorkshop />} />
        <Route path="/create-meeting" element={<CreateMeeting />} />
        <Route path="/mentor/mentee-information" element={<MenteeInformation />} />
        <Route path="/callback" element={<AuthCallback />} />
      </Routes>
    </div>
  );
}

export default App;
