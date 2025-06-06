import { useEffect, useState } from "react";
import "../css/notifycation.css";
import axios from "axios";
export default function Notifycation({ idUser }) {
  const [numberNoify, setNumberNotify] = useState(0);
  const [listNotify, setlistNotify] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/notify/${idUser}`)
      .then((respone) => {
        setNumberNotify(respone.data.length);
        setlistNotify(respone.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container__content--notify">
      <div className="number__notifycation">
        <span>{numberNoify}</span>
      </div>
      {/* <ul className="list--notifycation">
        {listNotify.map((notify, index) => (
          <li key={index}>
            <div className="container__sender--notify">
              <p>{notify.content}</p>
            </div>
            <div className="container__received--notify"></div>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
