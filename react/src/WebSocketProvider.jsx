import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import ChatPage from "./ChatPage.jsx";
import LoginPage from "./LoginPage.jsx";

export const WebSocketContext = createContext();

function WebSocketProvider({ children }) {
  const [stompClient, setStompClient] = useState(null);
  const baseURL = "http://xxx.xxx.x.xxx:8080";

  useEffect(() => {
    let sock = new SockJS(baseURL + "/ws");
    let stompVar = over(sock); // wraps the SockJS client with STOMP capabilities

    stompVar.connect(
      {}, // headers to send
      onConnected(stompVar), // called when STOMP connection is successful
      (e) => {
        console.log(e);
      }
    ); // called when STOMP connection is unsuccessful

    // clean up - unsubscribe and disconnect upon component unmount
    return () => {
        if (stompClient) {
            stompClient.disconnect()
        }
    }
  }, []);

  function onConnected(stompVar) {
    console.log("Web Socket connection successful.");
    setStompClient(stompVar);
  }

  return (
    <WebSocketContext.Provider value={stompClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chatPage" element={<ChatPage />} />
        </Routes>
      </Router>
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;
