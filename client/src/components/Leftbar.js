import React, { useEffect, useState } from "react";
import "./Leftbar.css";
// import { Users } from "../dummyData";
import { AppState } from "../context/ContextProvider";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

function Leftbar() {
  const { user } = AppState();
  const [users, setUsers] = useState([]);

  const IP = process.env.REACT_APP_IMAGE_PATH;

  useEffect(async () => {
    try {
      const { data } = await axios.get("/allUser", {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      setUsers(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="leftbar">
      <div className="leftbar-wrapper">
        <h3>Suggestion Friends </h3>
        {users.map((u) => (
          <div key={u._id}>
            <Link
              to={
                u._id !== user.data.userlog._id
                  ? "/profile/" + u._id
                  : "/profile"
              }
              style={{ textDecoration: "none" }}
            >
              <div className="user-list">
                <Avatar src={IP + u?.profilePic} />
                <span className="username">{u.name}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leftbar;
