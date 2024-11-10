import React, { type ReactElement } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MentorDashboard from "./pages/MentorDashboard";
import CreateWorkshop from "./pages/CreateWorkshop";
import CreateMeeting from "./pages/CreateMeeting";
function App(): ReactElement {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/mentor" element={<MentorDashboard />} />
          <Route path="/create-workshop" element={<CreateWorkshop />} />
          <Route path="/create-meeting" element={<CreateMeeting />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
