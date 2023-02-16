import { Avatar } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { AppState } from "../context/ContextProvider";

const FollowerUser = () => {
  const { user } = AppState();
  const [follower, setFollower] = useState([]);

  const IP = process.env.REACT_APP_IMAGE_PATH;

  useEffect(async () => {
    try {
      const { data } = await axios.get("/followerUser", {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      setFollower(data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <Header />
      {user.data.userlog.followers.length ? (
        <div style={{ padding: "1rem" }}>
          <h2>Followers ....</h2>
          {follower.map((f) => (
            <div
              key={f._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              <Avatar src={IP + f.profilePic} />
              <p style={{ marginLeft: ".5rem" }}> {f.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <h2 style={{ textAlign: "center", margin: "10%" }}>
          User do not have any followers !
        </h2>
      )}
    </>
  );
};

export default FollowerUser;
