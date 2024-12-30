import { useEffect, useState } from "react";
import { supabase } from "../superbase";

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
    <div>
      <h1>Welcome to the Dashboard</h1>
      {user ? (
        <div>
          <p>Email của bạn: {user.email}</p>

          <img
            src={avatar}
            alt="Avatar"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
    </div>
  );
}
