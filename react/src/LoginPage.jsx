import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function LoginPage() {
    const navigate = useNavigate()
    const baseURL = "http://localhost:8080/"

    const navigateToChat = () => {
        navigate("/chatPage")
    }
    
    const handleLogin = async(e) => {
        const username = document.getElementById("usernameInput").value
        const password = document.getElementById("passwordInput").value
        const send = [username, password]

        try {
            const response = await axios.post(baseURL + "login", send)
            if (response.data) {
                navigateToChat()
            } else {
                console.log("not logged in")
            }
        } catch (error) {
            console.error("Error logging in", error)
        }
    }

    return(
        <div className="login-box">
            <input type="text" id="usernameInput" placeholder="Username"/><br/>
            <input type="text" id="passwordInput" placeholder="Password"/><br/>
            <button onClick={handleLogin}>Login</button>
            <button>Register</button>
        </div>
    )
}

export default LoginPage