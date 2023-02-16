import React, { useState } from "react";
import "./Share.css";
import { Avatar } from "@material-ui/core";
import VideoLibrary from "@material-ui/icons/VideoLibrary";
import axios from "axios";
import { AppState } from "../context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

function Share() {
  const { user } = AppState();
  const [desc, setDesc] = useState("");
  const [pic, setPic] = useState("");

  const IP = process.env.REACT_APP_IMAGE_PATH;

  const navigate = useNavigate();

  const shareHandle = async (e) => {
    e.preventDefault();
    const data = new FormData();
    const fileName = pic.name;
    data.append("imgName", fileName);
    data.append("desc", desc);
    data.append("file", pic);

    if (!desc && !pic) {
      return alert("Please fill any input!");
    }
    try {
      const res = await axios.post("/post/create", data, {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      console.log(res);
      window.location.reload();
    } catch (error) {
      alert("post failed!");
    }
    setDesc("");
    setPic("");
  };

  return (
    <div className="share">
      <div className="share-wrapper">
        <div className="share-top">
          {/* <Avatar className="avatar" src={IP + user.data.userlog?.profilePic} /> */}
          <Link to={`/profile`}>
            <Avatar
              className="avatar"
              src={IP + user.data.userlog?.profilePic}
            />
          </Link>
          <input
            type="text"
            placeholder={`Hey "${user.data.userlog.name}", start a post ?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr />
        <form className="share-bottom">
          <div className="share-opts">
            <label htmlFor="file" className="share-opt">
              <VideoLibrary className="icon" style={{ color: "red" }} />
              <span>Select File</span>
              <input
                type="file"
                id="file"
                name="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => setPic(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>

            <button type="submit" onClick={shareHandle}>
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Share;
