import React from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "react-cookie/cjs/Cookies";
const cookies = new Cookies();
const Login = (props) => {
  const { setIsAuth } = props;
  //sign the user with google account
  const handleClick = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div id="login-page">
        <div id="login-card">
          <h2>
            welcom to <span id="app">BlaBla</span> chat
          </h2>
          <div className="login-button google" onClick={handleClick}>
            <GoogleOutlined /> Sign in
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
