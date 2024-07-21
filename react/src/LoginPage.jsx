import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import React, {useState} from 'react'

function LoginPage() {
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate()
    const baseURL = "http://localhost:8080"

    const navigateToChat = () => {
        console.log("Navigating to /chatPage...")
        navigate("/chatPage", {state: {username: userData.username}})
    }

    const resetInputs = () => {
        document.getElementById("usernameInput").value = ""
        document.getElementById("passwordInput").value = ""
    }

    const handleLogin = async() => {
        const send = [userData.username, userData.password]
        
        try {
            const loginRes = await axios.post(baseURL + "/login", send)
            if (loginRes.data == true) {
                console.log("[" + userData.username + "] logged in.")
                navigateToChat()
            } else {
                alert("User does not exist! Please create an account.")
                resetInputs()
            }
        } catch (error) {
            console.error("Error logging in", error)
        }
    }

    const handleRegister = async() => {
        if (userData.username == "" || userData.password == "") {
            alert("Username or Password cannot be empty!")
            return
        }

        const send = [userData.username, userData.password]

        try {
            const RegisterSuccess = await axios.post(baseURL + "/register", send)
            if (RegisterSuccess.data == true) {
                alert("User " + userData.username + " successfully created!")
            } else {
                alert("User already exists!")
            }

            resetInputs()
        } catch (error) {
            console.error("Error logging in", error)
        }
    }

    // note: specify button as type="button" to avoid double submission
    return(
        <div className="login-box">
            <input 
                type="text" 
                id="usernameInput" 
                placeholder="Username" 
                onChange={(e) => setUserData({...userData, "username": e.target.value})}/><br/>
            <input 
                type="text" 
                id="passwordInput" 
                placeholder="Password" 
                onChange={(e) => setUserData({...userData, "password": e.target.value})}/><br/>
            <button type="button" onClick={handleLogin}>Login</button> 
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default LoginPage