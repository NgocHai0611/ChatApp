import "../assets/css/login.css";
import { data, useNavigate } from "react-router-dom";
import { supabase } from "../superbase";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function FromLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = () => {
    console.log(email.toLowerCase(), password.toLowerCase());

    axios
      .post("https://chatapp-v1-dr09.onrender.com/users/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          // Hiển thị thông báo thành công
          toast.success("Login thành công! 🎉", {
            position: "top-right",
            autoClose: 3000, // Đặt thời gian đóng thông báo
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Chuyển trang sau khi thông báo hoàn thành
          setTimeout(() => {
            const user = response.data;
            user.provider = "tradition";
            console.log(user);
            navigate("/dashboard", { state: user }); // Điều hướng đến trang khác
          }, 3000); // Thời gian chờ bằng thời gian autoClose của toast
        } else {
          toast.error("Đăng nhập không thành công. Vui lòng thử lại!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi đăng nhập!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Login error:", error);
      });
  };

  const handelLoginAuth = async (e) => {
    e.preventDefault(); // Ngăn reload trang
    try {
      // Đăng nhập qua OAuth Discord , GG
      const { user, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard", // URL sau khi đăng nhập thành công
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Nếu không có lỗi, điều hướng đến trang Dashboard
      if (user) {
        console.log("User logged in:", user);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="form">
      <div className="title">
        Welcome,
        <br />
        <span>sign up to continue</span>
      </div>
      <input
        className="input"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="login-with">
        <div className="button-log">
          <b>t</b>
        </div>
        <div className="button-log btn-log__gg" onClick={handelLoginAuth}>
          <svg
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            width="56.6934px"
            viewBox="0 0 56.6934 56.6934"
            version="1.1"
            style={{ enableBackground: "new 0 0 56.6934 56.6934" }}
            id="Layer_1"
            height="56.6934px"
            className="icon"
          >
            <path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z" />
          </svg>
        </div>
        <div className="button-log">
          <svg
            className="icon"
            height="56.693px"
            id="Layer_1"
            version="1.1"
            viewBox="0 0 56.693 56.693"
            width="56.693px"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path d="M40.43,21.739h-7.645v-5.014c0-1.883,1.248-2.322,2.127-2.322c0.877,0,5.395,0,5.395,0V6.125l-7.43-0.029  c-8.248,0-10.125,6.174-10.125,10.125v5.518h-4.77v8.53h4.77c0,10.947,0,24.137,0,24.137h10.033c0,0,0-13.32,0-24.137h6.77  L40.43,21.739z" />
          </svg>
        </div>
      </div>
      <button className="button-confirm" onClick={handleLogin} type="button">
        Let`s go
      </button>
      <ToastContainer />
    </form>
  );
}
