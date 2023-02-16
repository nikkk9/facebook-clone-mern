import React from "react";
import "./Feed.css";
import Post from "./Post";
import Share from "./Share";
// import { Posts } from "../dummyData";

function Feed() {
  return (
    <div className="feed">
      <div className="feed-wrapper">
        <Share />
        <Post />
      </div>
    </div>
  );
}

export default Feed;
