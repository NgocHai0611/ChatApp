import { useEffect, useState } from "react";
import { supabase } from "../superbase";
import "../assets/css/dashboardchat.css";
import { io } from "socket.io-client";
import axios from "axios";
import { useLocation } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import Picker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faVideo,
  faPhone,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

import SearchUser from "../assets/components/SearchUser";
import ModalAddUserGroup from "../assets/components/ModalAddUserToGroup";

var socket;

export default function DashBoard() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [messageSend, setMessageSend] = useState("");
  const [listContact, setlistContact] = useState([]);
  const ENDPOINT = "http://localhost:3000"; //
  const [stateBoxChat, setStateBoxChat] = useState("none");
  const [messageTarget, setMessageTarget] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [idUser, setIdUser] = useState("");

  const [chatMessages, setChatMessages] = useState([]); // Lưu trữ tin nhắn đã nhận
  const [idChatRoom, setIdChatRoom] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Location dùng để lấy dữ liệu từ router
  const location = useLocation();
  // console.log(`User sau khi login ${location.state.data[0]}`);

  const handleShowMessage = (chat) => {
    setMessageTarget(chat);
    setListMessage([]);
    setStateBoxChat("display");
    setIdChatRoom(chat._id);
  };

  const handleShowUserNormal = (user, img) => {
    setUser(user);
    setAvatar(img);
    setIdUser(user.id);
  };

  const handleShowListMessage = (idUser) => {
    axios.get(`http://localhost:3000/chat/${idUser}`).then((response) => {
      setlistContact(response.data);
      setChatMessages(response.data);
    });
  };

  const sendMessage = () => {
    const data = {
      senderID: idUser,
      chatRoomID: idChatRoom,
      message: messageSend,
    };

    setMessageSend("");
    socket.emit("send_message", data);
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject.emoji);
    setChosenEmoji(emojiObject.emoji);
  };

  useEffect(() => {
    // Hàm lấy thông tin người dùng từ Supabase
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

    // Kiểm tra điều kiện và thực hiện logic
    if (location.state) {
      handleShowUserNormal(location.state.data[0], location.state.data[0].pic);
      handleShowListMessage(location.state.data[0].id);
    } else {
      fetchUser();
    }

    // Khởi tạo socket một lần khi component mount
    socket = io(ENDPOINT);

    // Lưu socket ID
    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
    });

    socket.emit("register", idUser, idChatRoom); // gửi userId tới server de join room

    socket.on("receive_message", (data) => {
      setListMessage((prevList) => [...prevList, data]);
    });

    // Cleanup khi component unmount
    return () => {
      socket.disconnect();
      socket.off("receive_message"); // Gỡ sự kiện khi component bị unmount
    };
  }, [idChatRoom]);

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
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />

              <a>Chat SynH</a>
              <div className="close">
                <div className="line one" />
                <div className="line two" />
              </div>
            </div>

            <div className="container--chat">
              <ul className="listUser">
                {/* Container Head */}
                <div className="container__search--chat">
                  <SearchUser></SearchUser>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    onClick={() => setIsModalOpen(true)}
                  />

                  <ModalAddUserGroup
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                  >
                    <h2>Thêm Thành Viên</h2>
                  </ModalAddUserGroup>
                </div>

                {listContact.map((chat, index) => (
                  <li
                    className="user__item"
                    key={index}
                    onClick={() => handleShowMessage(chat)}
                  >
                    {chat.isGroupChat ? (
                      <div className="container__nameChat">
                        <h1>{chat.chatName}</h1>
                        <div className="container__feature"></div>
                      </div>
                    ) : (
                      <h1>
                        {
                          chat.userDetails.find(
                            (userMap) => userMap._id !== user.id
                          )?.name
                        }
                      </h1> // Hiển thị user khác trong chat riêng
                    )}
                  </li>
                ))}
              </ul>

              {/* Area Chat */}

              <div className="area--chat">
                {stateBoxChat === "none" ? null : (
                  <div style={{ fontFamily: "Arial, sans-serif" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "500px",
                        border: "2px solid #ccc",
                        borderRadius: "5px",
                        overflowY: "auto",
                        marginBottom: "10px",
                      }}
                    >
                      {messageTarget.isGroupChat ? (
                        <div className="container__headline--chat">
                          <h1>{messageTarget.chatName}</h1>
                          <div className="container__feater--target">
                            <FontAwesomeIcon
                              className="size_feauter--icon"
                              icon={faUserPlus}
                            />
                            <FontAwesomeIcon
                              className="size_feauter--icon"
                              icon={faVideo}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="container__headline--chat">
                          <h1>
                            {
                              messageTarget.userDetails.find(
                                (userMap) => userMap._id !== user.id
                              )?.name
                            }
                          </h1>

                          <div className="container__feater--target">
                            <FontAwesomeIcon
                              className="size_feauter--icon"
                              icon={faPhone}
                            />
                            <FontAwesomeIcon
                              className="size_feauter--icon"
                              icon={faVideo}
                            />
                          </div>
                        </div>
                      )}

                      {/* Hiển thị các tin nhắn */}

                      {chatMessages.map((currentValue, index) =>
                        currentValue.messages
                          .filter((message) => message.chatID === idChatRoom) // Lọc đúng chatID
                          .sort((a, b) =>
                            new Date(a.timestamp) < new Date(b.timestamp)
                              ? -1
                              : 1
                          ) // Sắp xếp tăng dần
                          .map((message, index) =>
                            message.senderID === user.id ? (
                              <div
                                key={index}
                                className="container__messsage--send"
                              >
                                <div key={index} className="message__send">
                                  <p className="content__message--send">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="container__message--received"
                              >
                                <div className="message__received">
                                  <p>{message.senderID}</p>
                                  <p className="content__message--received">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            )
                          )
                      )}

                      {/* Các Tin Nhắn Trong Luc Chat */}
                      {listMessage.map((messageInChat, index) =>
                        messageInChat.senderID == idUser ? (
                          <div
                            key={index}
                            className="container__messsage--send"
                          >
                            <div key={index} className="message__send">
                              <p className="content__message--send">
                                {messageInChat.message}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="container__message--received"
                          >
                            <div className="message__received">
                              <p>{messageInChat.senderID}</p>
                              <p className="content__message--received">
                                {messageInChat.message}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Khu De An Nut Gui Tin Nhan */}
                    <div
                      style={{ display: "flex", height: 30 }}
                      className="box-chat"
                    >
                      <input
                        type="text"
                        value={messageSend}
                        onChange={(e) => setMessageSend(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />

                      <button
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#007BFF",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={sendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
