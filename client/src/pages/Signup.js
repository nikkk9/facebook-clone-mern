import React, { useState } from "react";
import "./Signup.css";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);

  const passShow = () => {
    setShow(!show);
  };

  const signupHandle = async () => {
    const data = new FormData();
    const fileName = pic.name;
    data.append("file", pic);
    data.append("imgName", fileName);
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);

    if (!name || !email || !password) {
      return alert("Please fill all the inputs");
    }
    try {
      const res = await axios.post("/user/signup", data);
      console.log(res);
      navigate("/login");
    } catch (error) {
      alert("something wrong!");
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <img
            src="https://media.istockphoto.com/photos/chat-discussion-icons-simple-3d-render-illustration-isolated-on-blue-picture-id1318720514?b=1&k=20&m=1318720514&s=170667a&w=0&h=B0F3ydUf702136laD-vCUM3MAt2PimVCPt6FGl_EpJU="
            alt=""
          />
        </div>
        <div className="loginRight">
          <div className="loginContainer">
            <input
              type="text"
              placeholder="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="pass">
              <input
                type={show ? "text" : "password"}
                // type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="passShow" onClick={passShow}>
                {show ? "hide" : "show"}{" "}
              </button>
            </div>
            <input
              type="file"
              placeholder="Profile pic"
              name="file"
              onChange={(e) => setPic(e.target.files[0])}
            />
            <button className="loginBtn" type="submit" onClick={signupHandle}>
              Sign Up
            </button>
            <Link className="loginLink" to="/login">
              <button className="loginBtnSignup">Log into your Account</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
