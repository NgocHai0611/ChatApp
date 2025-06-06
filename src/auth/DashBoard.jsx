import { useEffect, useState, useRef } from "react";
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
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import SearchUser from "../assets/components/SearchUser";
import ModalAddUserGroup from "../assets/components/ModalAddUserToGroup";
import Notifycation from "../assets/components/Notifycation";

export default function DashBoard() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [messageSend, setMessageSend] = useState("");
  const [listContact, setlistContact] = useState([]);
  const ENDPOINT = "https://chatapp-v1-dr09.onrender.com"; //
  const [stateBoxChat, setStateBoxChat] = useState("none");
  const [messageTarget, setMessageTarget] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [idUser, setIdUser] = useState("");

  const [chatMessages, setChatMessages] = useState([]); // Lưu trữ tin nhắn đã nhận
  const [messageSendStatus, setMessageSendStatus] = useState("Đã Gửi");
  const [idChatRoom, setIdChatRoom] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idLastestMessage, setIdLastestMessage] = useState("");

  const [typeModal, setTypeModal] = useState("");

  // Variable Này dùng để đánh dấu người nhận có tin nhắn mới mà chưa đọc
  const [statusSeen, setStatusSeen] = useState(false);

  const handleOpenModal = (type) => {
    setTypeModal(type);
    setIsModalOpen(true);
  };

  const socketRef = useRef(null);

  // Location dùng để lấy dữ liệu từ router
  const location = useLocation();
  // console.log(`User sau khi login ${location.state.data[0]}`);

  const handleShowMessage = (chat) => {
    setMessageTarget(chat);
    setListMessage([]);
    setStateBoxChat("display");
    setIdChatRoom(chat._id);
    setIdLastestMessage(chat.latestMessage);
    handleSentMessage(chat);
  };

  // Fc show thong tin sau khi đăng nhập bằng auth / normal
  const handleShowUserNormal = (user, img) => {
    setUser(user);
    setAvatar(img);
    setIdUser(user.id);
  };

  // Show Tất cả các đoạn tin nhắn mà người đùng đã nhắn
  function handleShowListMessage(idUser) {
    axios
      .get(`https://chatapp-v1-dr09.onrender.com/chat/${idUser}`)
      .then((response) => {
        const sortedList = response.data.sort(
          (a, b) => new Date(b.lastActivityTime) - new Date(a.lastActivityTime)
        );
        console.log(sortedList);
        setlistContact(sortedList);
        setChatMessages(sortedList);
      });
  }

  const handleShowMessageByTime = (idUser) => {
    if (!idUser) {
      console.warn(
        "handleShowMessageByTime được gọi với idUser null/undefined"
      );
      return;
    }

    console.log("Đang gọi handleShowMessageByTime với", idUser);
    axios
      .get(`https://chatapp-v1-dr09.onrender.com/chat/${idUser}`)
      .then((response) => {
        const sortedList = response.data.sort(
          (a, b) => new Date(b.lastActivityTime) - new Date(a.lastActivityTime)
        );
        console.log("Danh sách sau sort:", sortedList);
        setlistContact([...sortedList]);
      });
  };

  // Fc gửi tin nhắn và lưu tin nhắn
  const sendMessage = () => {
    const data = {
      senderID: idUser,
      chatID: idChatRoom,
      content: messageSend,
      readBy: [],
      timestamp: new Date(),
    };
    setMessageSend("");
    setListMessage((prevList) => [...prevList, data]);
    setMessageSendStatus("Đang gửi.....");

    axios
      .post("https://chatapp-v1-dr09.onrender.com/messages/sendMessage", data)
      .then((respone) => {
        if (respone.status === 200) {
          handleShowMessageByTime(idUser);
          setMessageSendStatus("Đã Gửi");
        }
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSentMessage = (chat) => {
    // console.log(chat, idLastestMessage);
    const messageLastest = chat.latestMessage;

    setIdLastestMessage(messageLastest);
    const resultMessageLastest = chat.messages.find(
      (message) => message._id === messageLastest
    );

    console.log(resultMessageLastest);

    if (
      resultMessageLastest.readBy.length <= 0 &&
      resultMessageLastest.senderID !== idUser
    ) {
      axios
        .post(
          `https://chatapp-v1-dr09.onrender.com/messages/seenMessages/${resultMessageLastest._id}`,
          {
            idUserRead: idUser,
          }
        )
        .then((respone) => {
          if (respone.status === 200) {
            setStatusSeen(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setStatusSeen(false);
    }
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

    if (!socketRef.current) {
      socketRef.current = io(ENDPOINT);
    }

    socketRef.current.on("connect", () => {
      console.log("Connected with ID:", socketRef.current.id);
    });

    // Đăng ký room riêng dựa trên userID
    socketRef.current.emit("register", idUser);

    // Nhận tin nhắn từ server
    socketRef.current.on("receive_message", (data) => {
      console.log("Received message event");
      handleShowMessageByTime(idUser);
      if (data.chatID === idChatRoom) {
        setListMessage((prevList) => [...prevList, data]);
      }
    });

    // // Nhận thông báo tin nhắn mới
    socketRef.current.on("new_message_notification", (data) => {
      console.log("Co Tin Nhan Toi Tu", data.senderID, idUser);
    });

    // Cleanup khi component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();

        socketRef.current = null;
      }
    };
  }, [idChatRoom, isModalOpen]);

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
                    onClick={() => handleOpenModal("createGroup")}
                  />
                  <span>+</span>
                  {/* Modal Create New Group */}
                  <ModalAddUserGroup
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    type={typeModal}
                    idUser={idUser}
                  />
                  <div className="container__notifycation">
                    <FontAwesomeIcon icon={faBell} />
                    <Notifycation idUser={idUser}></Notifycation>
                  </div>
                </div>

                {/* Gub */}
                {/* {console.log(listContact)} */}
                {listContact.map((chat, index) => (
                  <li
                    className="user__item"
                    key={index}
                    onClick={() => handleShowMessage(chat)}
                  >
                    {chat.isGroupChat ? (
                      <div className="container__nameChat">
                        <h1>{chat.chatName}</h1>
                        {chat.lastUserSender === idUser ? (
                          <div>
                            <span>You: </span>
                            <span>{chat.latestMessage}</span>
                          </div>
                        ) : (
                          <div>
                            <span>{chat.lastUserSender}: </span>
                            <span>{chat.latestMessage}</span>
                          </div>
                        )}
                        <div className="container__feature"></div>
                      </div>
                    ) : (
                      <div className="container__nameChat">
                        <h1>
                          {
                            chat.userDetails.find(
                              (userMap) => userMap._id !== user.id
                            )?.name
                          }
                        </h1>
                        {chat.lastUserSender === idUser ? (
                          <div style={{ display: "flex" }}>
                            <span>You: </span>
                            <span>{chat.latestMessage}</span>
                          </div>
                        ) : (
                          <div>
                            <span>{chat.latestMessage}</span>
                          </div>
                        )}
                        <div className="container__feature"></div>
                      </div>
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
                              onClick={() => handleOpenModal("addUser")}
                            />
                            <FontAwesomeIcon
                              className="size_feauter--icon"
                              icon={faVideo}
                            />

                            <ModalAddUserGroup
                              isOpen={isModalOpen}
                              onClose={() => setIsModalOpen(false)}
                              type={typeModal}
                              chatID={idChatRoom}
                              idUser={idUser}
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
                      {/* {console.log(chatMessages)} */}
                      {chatMessages.map((currentValue, index) =>
                        currentValue.messages
                          .filter((message) => message.chatID === idChatRoom) // Lọc đúng chatID
                          .sort((a, b) =>
                            new Date(a.timestamp) < new Date(b.timestamp)
                              ? -1
                              : 1
                          ) // Sắp xếp tăng dần và hiển thị message gửi
                          .map((message, index) =>
                            message.senderID === user.id ? (
                              <div
                                key={index}
                                className="container__messsage--send"
                              >
                                <div className="content__message--send">
                                  <p>{message.content}</p>
                                </div>

                                <div className="message--send--time">
                                  <p>
                                    {new Date(
                                      message.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>

                                  {/* {console.log(message._id)} */}

                                  {idLastestMessage == message._id ? (
                                    message.readBy &&
                                    message.readBy.length > 0 ? (
                                      <p>Đã Xem</p>
                                    ) : (
                                      <p>{messageSendStatus}</p>
                                    )
                                  ) : null}
                                </div>
                              </div>
                            ) : (
                              //Hiển thị message nhận
                              <div
                                key={index}
                                className="container__message--received"
                              >
                                <div className="content__message--recieved">
                                  <p className="user--recieved">
                                    {message.senderID}
                                  </p>
                                  <p>{message.content}</p>
                                </div>

                                <div className="message--recieved--time">
                                  <p>
                                    {new Date(
                                      message.timestamp
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            )
                          )
                      )}

                      {/* Các Tin Nhắn Trong Luc Chat */}
                      {listMessage.map((messageInChat, index) =>
                        messageInChat.senderID == idUser &&
                        messageInChat.chatID == idChatRoom ? (
                          <div
                            key={index}
                            className="container__messsage--send"
                          >
                            <div className="content__message--send">
                              <p>{messageInChat.content}</p>
                            </div>

                            <div className="message--send--time">
                              <p>
                                {new Date(
                                  messageInChat.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>

                              <p>{messageSendStatus}</p>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="container__message--received"
                          >
                            <div className="content__message--recieved">
                              <p className="user--recieved">
                                {messageInChat.senderID}
                              </p>
                              <p>{messageInChat.content}</p>
                            </div>

                            <div className="message--recieved--time">
                              <p>
                                {new Date(
                                  messageInChat.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
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
                      <button
                        style={{
                          backgroundColor: "black",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Disconnect
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
