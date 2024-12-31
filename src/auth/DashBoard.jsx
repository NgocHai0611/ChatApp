import { useEffect, useState } from "react";
import { supabase } from "../superbase";
import "../assets/css/dashboardchat.css";

export default function DashBoard() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchUser = () => {
      supabase.auth
        .getSession() // Gọi API để lấy thông tin session
        .then(({ data }) => {
          if (data.session) {
            const user = data.session.user;
            setAvatar(user.user_metadata.avatar_url);
            setUser(user); // Lưu thông tin người dùng
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin người dùng:", error); // Xử lý lỗi
        });
    };

    fetchUser();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", backgroundColor: "blue" }}>
      {user ? (
        <div>
          <p>Email của bạn: {user.email}</p>
          <div className="container">
            <div className="nav-bar">
              <img
                src={avatar}
                alt="Avatar"
                style={{ width: "30px", height: "30px", borderRadius: "50%" }}
              />

              <a>Chat SynH</a>
              <div className="close">
                <div className="line one" />
                <div className="line two" />
              </div>
            </div>

            <div className="container--chat">
              <div className="listUser"></div>

              <div className="area--chat"></div>
            </div>

            <div />
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
}
