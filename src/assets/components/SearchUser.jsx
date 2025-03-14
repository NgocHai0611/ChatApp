import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../css/tabSearch.css";

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]); // Dữ liệu từ API
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu sau khi lọc
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [selectedUsers, setSelectedUsers] = useState([]); // Danh sách users đã chọn
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

  useEffect(() => {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        setUsers(response.data); // Lưu toàn bộ users vào state
        setFilteredUsers(response.data); // Hiển thị mặc định tất cả users
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container__search">
      <div className="layout__search">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="icon__search--users"
        />
        <input
          type="text"
          className="input__search"
          value={query}
          onKeyUp={handleFindOnName} // Gọi hàm khi gõ phím
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Chỉ hiển thị select nếu có kết quả tìm kiếm */}
      {query && (
        <div className="container__list--result">
          {loading ? (
            <p>Đang Xử Lý...</p>
          ) : filteredUsers.length > 0 ? (
            <ul>
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
    </div>
  );
}
