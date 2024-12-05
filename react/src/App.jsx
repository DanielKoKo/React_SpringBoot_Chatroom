import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import React, {createContext} from 'react'
import ChatPage from './ChatPage.jsx'
import LoginPage from './LoginPage.jsx'
import WebSocketProvider from './WebSocketProvider.jsx'

// TODO - use singular websocket connection across loginpage and chatpage
// TODO - fix overflow issue with messages

function App() {
  return(
    <WebSocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/chatPage" element={<ChatPage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  )
}

export default App