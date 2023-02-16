import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import OtherProfile from "./pages/OtherProfile";
import { AppState } from "./context/ContextProvider";
import FollowingUserPost from "./pages/FollowingUserPost";
import FollowingUser from "./pages/FollowingUser";
import FollowerUser from "./pages/FollowerUser";

function App() {
  const { user, setUser } = AppState();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/login");
    }
  }, []);
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/profile" element={user && <Profile />} />
        <Route path="/profile/:userid" element={user && <OtherProfile />} />
        <Route path="/followingPost" element={user && <FollowingUserPost />} />
        <Route path="/followingUser" element={user && <FollowingUser />} />
        <Route path="/followerUser" element={user && <FollowerUser />} />
      </Routes>
    </div>
  );
}

export default App;
