import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import React, {useState} from 'react'

function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const baseURL = "http://localhost:8080/"

    const navigateToChat = () => {
        navigate("/chatPage", {state: {username:username}})
    }

    const resetInputs = () => {
        setUsername("")
        setPassword("")
    }

    const handleLogin = async() => {
        const send = [username, password]
        
        try {
            const isLoggedIn = await axios.post(baseURL + "login", send)
            if (isLoggedIn.data == true) {
                navigateToChat(username)
            } else {
                alert("User does not exist! Please create an account.")
                resetInputs()
            }
        } catch (error) {
            console.error("Error logging in", error)
        }
    }

    const handleRegister = async() => {
        const send = [username, password]

        try {
            const RegisterSuccess = await axios.post(baseURL + "register", send)
            if (RegisterSuccess.data == true) {
                alert("User " + username + " successfully created!")
            } else {
                alert("User already exists! Please log in.")
            }

            resetInputs()
        } catch (error) {
            console.error("Error logging in", error)
        }
    }

    return(
        <div className="login-box">
            <input 
                type="text" 
                id="usernameInput" 
                placeholder="Username" 
                onChange={(e) => setUsername(e.target.value)} 
                value={username}/><br/>
            <input 
                type="text" 
                id="passwordInput" 
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}/><br/>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default LoginPage