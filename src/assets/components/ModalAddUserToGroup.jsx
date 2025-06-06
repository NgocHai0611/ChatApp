import "../css/modalAddUser.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ModalAddUserGroup({
  isOpen,
  onClose,
  children,
  type,
  chatID = "",
  idUser = "",
}) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]); // Dữ liệu từ API
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu sau khi lọc
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [selectedUsers, setSelectedUsers] = useState([]); // Danh sách users đã chọn
  const [chatRoom, setChatRoom] = useState(chatID || ""); //đảm bảo chatRoom luôn có giá trị mặc định,
  const [newNameChat, setNewNameChat] = useState("");

  // Xử lý sự kiện khi nhấn phím trong ô input
  const handleFindOnName = (e) => {
    const searchText = e.target.value.toLowerCase();
    setQuery(e.target.value);
    setLoading(true); // Bắt đầu tìm kiếm, bật loading

    // Nếu chưa nhập, xóa danh sách
    if (searchText === "") {
      setFilteredUsers([]);
      setLoading(false);
      return;
    }

    // Giả lập thời gian xử lý (hoặc có thể bỏ nếu API nhanh)
    setTimeout(() => {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
      );

      setFilteredUsers(filtered);
      setLoading(false); // Kết thúc tìm kiếm
    }, 500);
  };

  // Xử lý khi chọn user trong select option
  const handleCheckboxChange = (userId) => {
    setSelectedUsers(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // Bỏ chọn
          : [...prevSelected, userId] // Chọn thêm
    );
  };

  const handleAddToGroup = () => {
    console.log(selectedUsers);
    axios
      .post("http://localhost:3000/chat/addUserToGroup", {
        chatID: chatRoom,
        users: selectedUsers,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Add User To Group Success 🎉", {
            position: "top-right",
            autoClose: 3000, // Đặt thời gian đóng thông báo
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setTimeout(() => {
            onClose();
          }, 3000); // Thời gian chờ bằng thời gian autoClose của toast
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateGroup = () => {
    console.log(selectedUsers, newNameChat);
    axios
      .post("http://localhost:3000/chat/createGroup", {
        chatName: newNameChat,
        users: selectedUsers,
        groupAdmin: idUser,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Tạo Group Thành Công! 🎉", {
            position: "top-right",
            autoClose: 3000, // Đặt thời gian đóng thông báo
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setTimeout(() => {
            onClose();
          }, 3000); // Thời gian chờ bằng thời gian autoClose của toast
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(`chatID: ${chatRoom}`);
    axios
      .post("http://localhost:3000/chat/getUsersNotInGroup", { chatRoom })
      .then((response) => {
        setUsers(response.data); // Lưu toàn bộ users vào state
        setFilteredUsers(response.data); // Hiển thị mặc định tất cả users
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatRoom]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        {type === "createGroup" ? (
          <div className="conatiner__input--find">
            <h2>Tạo Nhóm</h2>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ position: "absolute", marginTop: 70 }}
            />
            <input
              type="text"
              placeholder="Nhập Tên"
              className="input__search--phoneNumber"
              value={query}
              onKeyUp={handleFindOnName} // Gọi hàm khi gõ phím
              onChange={(e) => setQuery(e.target.value)} // Cập nhật state query
            />
            <input
              placeholder="Nhập Tên Nhóm"
              onChange={(e) => setNewNameChat(e.target.value)}
            ></input>
          </div>
        ) : (
          <div className="conatiner__input--find">
            <h2>Thêm Thành Viên</h2>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ position: "absolute" }}
            />
            <input
              type="text"
              placeholder="Nhập Tên"
              className="input__search--phoneNumber"
              value={query}
              onKeyUp={handleFindOnName} // Gọi hàm khi gõ phím
              onChange={(e) => setQuery(e.target.value)} // Cập nhật state query
            />
          </div>
        )}

        {/* Chỉ hiển thị select nếu có kết quả tìm kiếm */}
        {query && (
          <div>
            {loading ? (
              <p>Đang Xử Lý...</p>
            ) : filteredUsers.length > 0 ? (
              <ul className="list__user--result" style={{ marginTop: 50 }}>
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        value={user.id}
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleCheckboxChange(user.id)}
                      />
                      <span className="custom-checkbox"></span>
                      {user.name}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không tìm thấy user nào</p>
            )}
          </div>
        )}
        {query && filteredUsers.length > 0 ? (
          <div>
            {type === "createGroup" ? (
              <div className="container__btn--add">
                <button style={{ background: "red", color: "white" }}>
                  Cancel
                </button>
                <button onClick={handleCreateGroup}>Tạo Nhóm</button>
              </div>
            ) : (
              <div className="container__btn--add">
                <button style={{ background: "red", color: "white" }}>
                  Cancel
                </button>
                <button onClick={handleAddToGroup}>Thêm Thành Viên</button>
              </div>
            )}
          </div>
        ) : null}
        <ToastContainer />
      </div>
    </div>
  );
}
