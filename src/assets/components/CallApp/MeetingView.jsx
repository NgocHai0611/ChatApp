import React, { useEffect, useRef } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";

export default function MeetingView({ meetingId, onLeave }) {
  const { join, leave, participants, localParticipant } = useMeeting({
    onMeetingJoined: () => console.log("✅ Đã tham gia cuộc họp"),
    onMeetingLeft: () => {
      console.log("❌ Đã rời khỏi cuộc họp");
      onLeave();
    },
  });

  const hasJoined = useRef(false); // Tránh gọi join() nhiều lần

  useEffect(() => {
    if (!hasJoined.current) {
      console.log("🚀 Đang tham gia cuộc họp...");
      join();
      hasJoined.current = true;
    }
  }, []); // Chỉ chạy 1 lần khi component mount

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h3>Đang tham gia cuộc họp</h3>
      <p>Meeting ID: {meetingId}</p>

      <button onClick={leave} style={{ marginLeft: "10px" }}>
        Rời cuộc họp
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "20px",
          justifyContent: "center",
        }}
      >
        {localParticipant && (
          <ParticipantView participantId={localParticipant.id} />
        )}
        {[...participants.keys()].map((participantId) =>
          participantId !== localParticipant?.id ? (
            <ParticipantView
              key={participantId}
              participantId={participantId}
            />
          ) : null
        )}
      </div>
    </div>
  );
}
