import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ChatPage from './ChatPage.jsx'
import LoginPage from './LoginPage.jsx'

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/chatPage" element={<ChatPage/>}/>
      </Routes>
    </Router>
)
}

export default App
