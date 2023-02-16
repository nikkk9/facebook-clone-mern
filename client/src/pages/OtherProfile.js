import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../components/Header";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/Rightbar";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { AppState } from "../context/ContextProvider";
import { Link, useParams } from "react-router-dom";
import MoreVert from "@material-ui/icons/MoreVert";
import { format } from "timeago.js";

function OtherProfile() {
  const { user, setUser } = AppState();
  const [post, setPost] = useState([]);
  const IP = process.env.REACT_APP_IMAGE_PATH;
  const { userid } = useParams();
  const [showfollow, setShowfollow] = useState(
    user ? !user.data.userlog.followings.includes(userid) : true
  );

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`/user/${userid}`, {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      console.log(data);
      setPost(data);
    };
    fetchUser();
  }, []);
  // console.log(post);

  const followUser = async () => {
    const { data } = await axios.put(
      "/follow",
      {
        userId: userid,
      },
      {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      }
    );
    console.log(data);
    setPost((prevState) => {
      return {
        ...prevState,
        getUser: {
          ...prevState.getUser,
          followers: [...prevState.getUser.followers, data._id],
        },
      };
    });
    setShowfollow(false);
  };
  const unfollowUser = async () => {
    const { data } = await axios.put(
      "/unfollow",
      {
        userId: userid,
      },
      {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      }
    );
    console.log(data);
    setPost((prevState) => {
      return {
        ...prevState,
        getUser: {
          ...prevState.getUser,
          followers: prevState.getUser.followers.filter(
            (item) => item !== data._id
          ),
        },
      };
    });
    setShowfollow(true);
  };

  return (
    <>
      <div className="profile">
        <Header />
        <div className="profileContainer">
          <Leftbar />
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  src={IP + post.getUser?.profilePic}
                  className="profileUserImg"
                />
              </div>
              <div className="profileInfo">
                <h4>{post.getUser?.name}</h4>
                <span>{post.getUser?.email}</span>
                <div style={{ display: "flex", marginTop: "1rem" }}>
                  <p>{post.posts?.length} Posts</p>
                  <p>{post.getUser?.followings.length} followings</p>
                  <p>{post.getUser?.followers.length} Followers</p>
                </div>

                {showfollow ? (
                  <button
                    onClick={followUser}
                    style={{
                      padding: ".5rem 1rem",
                      backgroundColor: "#006308",
                      color: "aliceblue",
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "2px",
                      marginTop: "1rem",
                      fontSize: "1rem",
                    }}
                  >
                    Follow
                  </button>
                ) : (
                  <button
                    onClick={unfollowUser}
                    style={{
                      padding: ".5rem 1rem",
                      backgroundColor: "#b50101",
                      color: "aliceblue",
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "2px",
                      marginTop: "1rem",
                      fontSize: "1rem",
                    }}
                  >
                    Unfollow
                  </button>
                )}
              </div>
            </div>
            <div className="profileRightBottom">
              {post.posts?.map((p) => (
                <div className="post" key={p._id}>
                  <div className="post-wrapper">
                    <div className="post-top">
                      <div className="post-top-left">
                        <Link to={`/profile`}>
                          <Avatar src={IP + p.userId.profilePic} />
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
                      {/* ? is optional sign why we are using in this line because desc is optional field */}
                      <p>{p?.desc} </p>
                    </div>
                    <div className="post-bottom">
                      <div className="post-bottom-left">
                        <span>{p.likes.length} people liked it</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Rightbar />
        </div>
      </div>
    </>
  );
}

export default OtherProfile;
