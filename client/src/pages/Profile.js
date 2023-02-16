import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../components/Header";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { AppState } from "../context/ContextProvider";
import { Link } from "react-router-dom";
import MoreVert from "@material-ui/icons/MoreVert";
import { format } from "timeago.js";

function Profile() {
  const { user, setUser } = AppState();
  const [post, setPost] = useState([]);
  const IP = process.env.REACT_APP_IMAGE_PATH;
  // console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get("/myPost", {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      // console.log(data);
      setPost(data);
    };
    fetchUser();
  }, []);

  console.log(post);

  return (
    <div className="profile">
      <Header />
      <div className="profileContainer">
        <Leftbar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={IP + user.data?.userlog.profilePic}
                className="profileUserImg"
              />
            </div>
            <div className="profileInfo">
              <h4>{user.data.userlog.name}</h4>
              <span>{user.data.userlog.email}</span>
              <div style={{ marginTop: "1rem", display: "flex" }}>
                <p>
                  <b>{post.length}</b> Posts
                </p>
                <Link to="/followingUser" className="profileInfoLink">
                  <p>
                    <b>{user.data.userlog.followings.length}</b> Followings
                  </p>
                </Link>
                <Link to="/followerUser" className="profileInfoLink">
                  <p>
                    <b>{user.data.userlog.followers.length}</b> Followers
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="profileRightBottom">
            {post.length ? (
              post.map((p) => (
                <div className="post" key={p._id}>
                  <div className="post-wrapper">
                    <div className="post-top">
                      <div className="post-top-left">
                        <Link to={`/profile`}>
                          <Avatar src={IP + user.data.userlog?.profilePic} />
                        </Link>
                        <span className="username">
                          {user.data.userlog.name}
                        </span>
                        <span className="time">{format(p.createdAt)}</span>
                      </div>
                      <div className="post-top-right">
                        <MoreVert />
                      </div>
                    </div>
                    <div className="post-mid">
                      <img src={IP + p?.img} alt="" />
                      {/* ? is optional sign why we are using in this line because desc is optional field */}
                      <p>{p?.desc} </p>
                    </div>
                    <div className="post-bottom">
                      <div className="post-bottom-left">
                        <span>{p.likes.length} people liked it</span>
                      </div>
                      <div className="post-bottom-right">
                        <span>{p.comment} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h2 style={{ textAlign: "center", margin: "10%" }}>
                User's have not posted any post !
              </h2>
            )}
          </div>
        </div>
        <Rightbar />
      </div>
    </div>
  );
}

export default Profile;
