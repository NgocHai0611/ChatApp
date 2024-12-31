import { useState } from "react";

import FromLogin from "./auth/Login";
import DashBoard from "./auth/DashBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="login" />} />
            <Route path="login" element={<FromLogin />} />
            <Route path="dashboard" element={<DashBoard></DashBoard>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
