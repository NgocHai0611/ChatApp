import React, { useState, useEffect } from "react";
import MeetingComponent from "./MeetingComponent";
import { getToken, createMeeting } from "./api";

const VideoCall = () => {
  const [meetingId, setMeetingId] = useState(null);
  const [token, setToken] = useState(null);
  const [inputMeetingId, setInputMeetingId] = useState("");

  // Lấy token khi mở app
  useEffect(() => {
    const fetchToken = async () => {
      const userToken = await getToken();
      if (userToken) setToken(userToken);
    };
    fetchToken();
  }, []);

  // Tạo cuộc họp và vào phòng ngay
  const handleCreateMeeting = async () => {
    if (!token) return;
    const newMeetingId = await createMeeting(token);
    if (newMeetingId) {
      setMeetingId(newMeetingId);
    }
  };

  // Tham gia cuộc họp bằng ID nhập vào
  const handleJoinMeeting = () => {
    if (inputMeetingId) {
      setMeetingId(inputMeetingId);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!meetingId ? (
        <div>
          <h2>Chào mừng đến với Video Call</h2>
          <button onClick={handleCreateMeeting} disabled={!token}>
            {token ? "Tạo cuộc họp" : "Đang lấy token..."}
          </button>

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Nhập ID cuộc họp"
              value={inputMeetingId}
              onChange={(e) => setInputMeetingId(e.target.value)}
            />
            <button onClick={handleJoinMeeting} disabled={!inputMeetingId}>
              Tham gia cuộc họp
            </button>
          </div>
        </div>
      ) : (
        <MeetingComponent meetingId={meetingId} token={token} />
      )}
    </div>
  );
};

export default VideoCall;
