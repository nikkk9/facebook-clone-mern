import React, { useEffect, useState } from "react";
import "./Header.css";
import Search from "@material-ui/icons/Search";
import { Avatar, Box, Modal, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../context/ContextProvider";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Header() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user, setUser } = AppState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const IP = process.env.REACT_APP_IMAGE_PATH;

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) navigate("/login");
  }, []);

  const logoutHandle = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const searchUser = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(`/user-search?search=${search}`, {
      headers: {
        Authorization: `Bearer ${user.data.accessToken}`,
      },
    });

    console.log(data);
    setSearchResult(data);
  };

  return (
    <>
      <Modal
        open={open}
        // onClose={handleClose}
        onClose={() => {
          setSearch("");
          setSearchResult([]);
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2 }}
            component={"span"}
          >
            <form>
              <input
                type="text"
                placeholder="Search for friends"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: "1rem 2rem", border: "1px solid black" }}
              />{" "}
              <button
                type="submit"
                onClick={searchUser}
                style={{ display: "none" }}
              />
            </form>
          </Typography>
          {searchResult.map((u) => (
            <Link
              to={`/profile/${u._id}`}
              key={u._id}
              style={{ width: "100%", textDecoration: "none", color: "black" }}
            >
              <div
                key={u._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1rem",
                  cursor: "pointer",
                }}
              >
                <Avatar src={IP + u.profilePic} />
                <span
                  style={{
                    backgroundColor: "#dcdcdc",
                    padding: ".5rem 1rem",
                    marginLeft: ".5rem",
                    width: "100%",
                  }}
                >
                  {u.name}
                </span>
              </div>
            </Link>
          ))}
        </Box>
      </Modal>
      <div className="header">
        <div className="header-left">
          <Link to="/" style={{ textDecoration: "none" }}>
            {/* <h3>&lt; / &gt;</h3> */}
            <img
              style={{
                height: "3rem",
                width: "3rem",
                borderRadius: "50% ",
                marginLeft: "1rem",
              }}
              src="https://media.istockphoto.com/photos/chat-discussion-icons-simple-3d-render-illustration-isolated-on-blue-picture-id1318720514?b=1&k=20&m=1318720514&s=170667a&w=0&h=B0F3ydUf702136laD-vCUM3MAt2PimVCPt6FGl_EpJU="
              alt=""
            />
          </Link>
        </div>

        <div className="header-mid">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for friends"
              onClick={handleOpen}
            />
          </div>
        </div>

        <div className="header-right">
          <div className="links">
            <span onClick={() => navigate("/followingPost")}>
              FOLLOWING POSTS
            </span>
          </div>
          <p onClick={logoutHandle}>LOGOUT</p>
          <Link to={`/profile`}>
            <Avatar
              className="avatar"
              src={IP + user.data.userlog?.profilePic}
            />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Header;
