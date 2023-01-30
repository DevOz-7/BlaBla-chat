import Login from "./components/Login";
import { Cookies } from "react-cookie";
import { useState, useRef } from "react";
import "./App.css";
import Chat from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
const cookies = new Cookies();
function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);
  //sign out from the app
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setRoom(null);
  };
  //looking if the user is authenticated if so he will move to chat component
  if (!isAuth) {
    return (
      <div>
        <Login setIsAuth={setIsAuth} />
      </div>
    );
  }
  return (
    <>
      {room ? (
        <Chat room={room} />
      ) : (
        <div id="chat-room">
          <div id="room-card">
            <div className="room center">
              <label>Enter Room </label>
              <input ref={roomInputRef} />
              <button onClick={() => setRoom(roomInputRef.current.value)}>
                Enter Chat
              </button>
              <button onClick={signUserOut}>Sign out</button>
            </div>
          </div>
        </div>
      )}
      <div className="sign-out"></div>
    </>
  );
}

export default App;
