import axios from "axios";

const API_URL = "http://localhost:3000";
const VIDEO_API_KEY = "a14f7112-febf-4f51-9f1d-31dfde2eebc6";

// Lấy token từ server
export const getToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/get-token`);

    return response.data.token;
  } catch (error) {
    console.error("Lỗi lấy token:", error);
    return null;
  }
};

// Tạo Meeting
export const createMeeting = async (token) => {
  console.log("Token sử dụng:", token);

  if (!token) {
    console.error("❌ Token bị null hoặc undefined!");
    return null;
  }

  try {
    const response = await axios.post(
      "https://api.videosdk.live/v2/rooms",
      {}, // Object rỗng bắt buộc
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Meeting created:", response.data);
    return response.data.roomId;
  } catch (error) {
    console.error("❌ Lỗi tạo meeting:", error.response?.data || error);
    return null;
  }
};
