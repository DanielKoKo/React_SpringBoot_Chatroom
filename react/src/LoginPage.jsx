import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import './LoginPage.css'

function LoginPage() {
    const [signup, setSignup] = useState(false)
    const [info, setInfo] = useState("") // e.g. "incorrect username/password", "account already exists", etc.
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const baseURL = "http://xxx.xxx.x.xxx:8080" // modify IP address after install

    // clears input when switch from sign in -> sign up and vice versa
    useEffect(() => {
        resetInputs()
    }, [signup]);

    const navigateToChat = () => {
        navigate("/chatPage", {state: {username: userData.username}})
    }

    function resetInputs() {
        document.getElementById("usernameInput").value = ""
        document.getElementById("passwordInput").value = ""
        let confirmInput = document.getElementById("confirmPasswordInput")

        setUserData({
            username: "",
            password: ""
        })

        // need to check if confirmPasswordInput exists first becasue it's only rendered
        // in sign up page
        if (confirmInput) {
            setConfirmPassword("")
            confirmInput.value = ""
        }
    }
    
    function verifyFields() {
        if (userData.username === "" || userData.password === "") {
            setInfo("Username or password field must not be empty.")
            return false
        }

        if (signup && (userData.password !== confirmPassword)) {
            setInfo("Passwords do not match.")
            return false
        }

        return true
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            signup ? handleAxio("/register") : handleAxio("/login")
        }
    }

    const handleAxio = async(path) => {
        if (!verifyFields()) {
            resetInputs()
            return
        }

        const send = [userData.username, userData.password]

        try {
            const res = await axios.post(baseURL + path, send)
            
            if (res.data === true) {
                if (path === "/login") {
                    setInfo("Logging in...")
                } 
                else if (path === "/register") {
                    stompClient.send('/app/message', {}, JSON.stringify({senderName: userData.username, status: "JOIN"}))
                    setInfo("Account successfully created! Logging in...")
                }

                await new Promise(resolve => setTimeout(resolve, 1500))
                navigateToChat()
            }
            else {
                path === "/login" ? setInfo("Incorrect username or password.") : setInfo("Username is already taken.")
            }

            resetInputs()
        } catch (error) {
            setInfo("Connection error.")
            resetInputs()
        }
    }

    function renderInfo() {
        // Don't render if no info message exists
        if (!info)
            return null

        return (info === "Logging in..." || 
                info === "Account successfully created! Logging in...") ? <span id="success">{info}</span> :
                                                                            <span id="error">{info}</span>
    }

    const renderLoginOrSignup = () => (
        (!signup) ? renderLogin() : renderSignup()
    )

    function renderFields() {
      return (
        <>
            <input 
                type="text" 
                id="usernameInput" 
                placeholder="Username" 
                autoComplete="off"
                onChange={(e) => {setUserData({...userData, "username": e.target.value})
                          setInfo("")
                         }}
                onKeyDown={handleKeyPress}
            /><br/>
            <input 
                type="password" 
                id="passwordInput" 
                placeholder="Password" 
                onChange={(e) => {setUserData({...userData, "password": e.target.value})
                          setInfo("")
                         }}
                onKeyDown={handleKeyPress}
            /><br/>
        </>
      )  
    }

    function renderLogin() {
        return (
            <div className="form">
                {renderInfo()}
                {renderFields()}
                <div className="buttons">
                    <button type="button" onClick={() => {handleAxio("/login")}}>Login</button> 
                    <p>OR</p>
                    <GoogleLogin
                    onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    const decoded = jwtDecode(credentialResponse.credential);
                    console.log('decoded: ' + JSON.stringify(decoded));
                    }}
                    onError={() => {
                    console.log("Login Failed");
                    }}
                />
                    <span>
                        Don't have an account?
                        <button type="button" className="underline-button" onClick={() => {setSignup(true)}}>Sign up</button>
                    </span>
                </div>
            </div>
        )
    }

    function renderSignup() {
        return (
            <div className="form">
                {renderInfo()}
                {renderFields()}
                <input 
                    type="password" 
                    id="confirmPasswordInput" 
                    placeholder="Confirm password" 
                    onChange={(e) => {setConfirmPassword(e.target.value)
                              setInfo("")
                             }}
                /><br/>
                <div className="buttons">
                    <button type="button" onClick={() => {handleAxio("/register")}}>Register</button> 
                    <span>
                        Have an account?
                        <button type="button" className="underline-button" onClick={() => {setSignup(false)}}>Sign in</button>
                    </span>
                </div>
            </div>
        )
    }

    // - specify button as type="button" to avoid double submission (default browser behavior)
    // - need spread operators for setUserData because otherwise, the unspecified parameter will be set to ""
    return(
        <div className="login-box">
            {renderLoginOrSignup()}
        </div>
    )
}

export default LoginPage
