import React, { useEffect, useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }) => {
  const webcamRef = useRef(null);
  const micRef = useRef(null);
  const { webcamStream, micStream, isLocal } = useParticipant(participantId);

  useEffect(() => {
    if (webcamRef.current && webcamStream?.track) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      webcamRef.current.srcObject = mediaStream;
      webcamRef.current
        .play()
        .catch((err) => console.log("Lỗi phát video:", err));
    }
  }, [webcamStream]);

  useEffect(() => {
    if (micRef.current && micStream?.track) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current
        .play()
        .catch((err) => console.log("Lỗi phát âm thanh:", err));
    }
  }, [micStream]);

  return (
    <div
      style={{
        margin: "10px",
        border: "1px solid gray",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <p>{isLocal ? "Bạn" : `Người tham gia ${participantId}`}</p>
      <video
        ref={webcamRef}
        autoPlay
        muted={isLocal}
        width="200"
        height="150"
        style={{ backgroundColor: "black" }}
      />
      <audio ref={micRef} autoPlay />
    </div>
  );
};

export default ParticipantView;
