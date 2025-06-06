import { useEffect, useState } from "react";
import FromLogin from "./auth/Login";
import DashBoard from "./auth/DashBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Video call
import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import VideoCall from "./assets/components/CallApp/VideoCall";
import { createMeeting, getToken } from "./assets/components/CallApp/api"; // Import API

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<FromLogin />} />
            <Route path="dashboard" element={<DashBoard></DashBoard>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );

  // Video Call Module
  // return (
  //   <div>
  //     <VideoCall></VideoCall>
  //   </div>
  // );
}

export default App;
