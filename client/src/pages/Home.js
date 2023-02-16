import React from "react";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Header />
      <div className="home-container">
        <Leftbar />
        <Feed />
        <Rightbar />
      </div>
    </div>
  );
}

export default Home;
