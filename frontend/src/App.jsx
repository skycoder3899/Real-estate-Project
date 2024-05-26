import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import Login from "./pages/Login";
import Sign from "./pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Buyer />} />
          <Route element={<PrivateRoute />}>
            <Route path="/Seller" element={<Seller />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Sign />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
