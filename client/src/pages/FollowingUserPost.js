import React, { useEffect, useState } from "react";
import "../components/Post.css";
import MoreVert from "@material-ui/icons/MoreVert";
// import { Users } from "../dummyData";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { AppState } from "../context/ContextProvider";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

function FollowingUserPost() {
  const { user } = AppState();
  const [posts, setPosts] = useState([]);
  console.log(posts);

  const IP = process.env.REACT_APP_IMAGE_PATH;

  useEffect(async () => {
    try {
      const { data } = await axios.get("/followingUserPost", {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const likeHandle = async (id) => {
    try {
      const { data } = await axios.put(
        "/post/like",
        { postId: id },
        {
          headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
          },
        }
      );
      console.log(data);
      setPosts(posts.map((p) => (p._id === data._id ? data : p)));
    } catch (error) {
      console.log(error);
    }
  };

  const dislikeHandle = async (id) => {
    try {
      const { data } = await axios.put(
        "/post/dislike",
        { postId: id },
        {
          headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
          },
        }
      );
      console.log(data);
      setPosts(posts.map((p) => (p._id === data._id ? data : p)));
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandle = async (text, postId) => {
    try {
      let { data } = await axios.put(
        "/post/comment",
        { postId, text },
        {
          headers: {
            Authorization: `Bearer ${user.data.accessToken}`,
          },
        }
      );
      console.log(data);
      setPosts(posts.map((p) => (p._id === data._id ? data : p)));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h2 style={{ padding: "1rem" }}>Posts of your friends ....</h2>
      {posts.length ? (
        posts.map((p) => (
          <div
            className="post"
            key={p._id}
            style={{
              margin: "2rem auto",
            }}
          >
            <div className="post-wrapper">
              <div className="post-top">
                <div className="post-top-left">
                  <Link
                    to={
                      p.userId._id !== user.data.userlog._id
                        ? "/profile/" + p.userId._id
                        : "/profile"
                    }
                  >
                    <Avatar src={IP + p.userId?.profilePic} />
                  </Link>
                  <span className="username">{p.userId.name}</span>
                  <span className="time">{format(p.createdAt)}</span>
                </div>
                <div className="post-top-right">
                  <MoreVert />
                </div>
              </div>
              <div className="post-mid">
                <img src={IP + p?.img} alt="" />
                {/* ? is optional operator, we are using in this operator because desc is optional field */}
                <p>{p?.desc} </p>
              </div>
              <div className="post-bottom">
                <div className="post-bottom-left">
                  {p.likes.includes(user.data.userlog._id) ? (
                    <Favorite
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => dislikeHandle(p._id)}
                    />
                  ) : (
                    <FavoriteBorder
                      style={{ color: "gray", cursor: "pointer" }}
                      onClick={() => likeHandle(p._id)}
                    />
                  )}

                  <span>{p.likes.length} people liked it</span>
                </div>
                <div className="post-bottom-right"></div>
              </div>
              {p.comments.map((c) => (
                <h5 key={c._id} style={{ marginTop: "0.5rem" }}>
                  {c.userId.name}
                  <span style={{ fontWeight: "400" }}> {c.text}</span>
                </h5>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  commentHandle(e.target[0].value, p._id);
                }}
                style={{ marginTop: "0.5rem" }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        ))
      ) : (
        <h2 style={{ textAlign: "center", margin: "10%" }}>
          User's have not posted any post !
        </h2>
      )}
    </>
  );
}

export default FollowingUserPost;
