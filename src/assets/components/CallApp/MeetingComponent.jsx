import React, { useEffect, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import MeetingView from "./MeetingView";

const MeetingComponent = ({ meetingId, token }) => {
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (meetingId && token) {
      setHasJoined(true);
    }
  }, [meetingId, token]);

  if (!meetingId || !token) {
    return <p>❌ Lỗi: meetingId hoặc token không hợp lệ.</p>;
  }

  return (
    <MeetingProvider
      config={{
        meetingId: meetingId,
        micEnabled: true,
        webcamEnabled: true,
      }}
      token={token}
    >
      {hasJoined ? (
        <MeetingView
          meetingId={meetingId}
          onLeave={() => setHasJoined(false)}
        />
      ) : (
        <p>🔄 Đang vào phòng họp...</p>
      )}
    </MeetingProvider>
  );
};

export default MeetingComponent;
