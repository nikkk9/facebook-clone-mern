import { Avatar } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AppState } from "../context/ContextProvider";
import Header from "../components/Header";

const FollowingUser = () => {
  const { user } = AppState();
  const [following, setFollowing] = useState([]);

  const IP = process.env.REACT_APP_IMAGE_PATH;

  useEffect(async () => {
    try {
      const { data } = await axios.get("/followingUser", {
        headers: {
          Authorization: `Bearer ${user.data.accessToken}`,
        },
      });
      setFollowing(data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <Header />
      {user.data.userlog.followings.length ? (
        <div style={{ padding: "1rem" }}>
          <h2>Following users ....</h2>
          {following.map((f) => (
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
          User is not following anyone !
        </h2>
      )}
    </>
  );
};

export default FollowingUser;
