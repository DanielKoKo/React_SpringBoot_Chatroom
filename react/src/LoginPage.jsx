import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import './LoginPage.css'
import {WebSocketContext} from './WebSocketProvider.jsx'
import {over} from 'stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

function LoginPage() {
    const [info, setInfo] = useState("") // e.g. "incorrect username/password", "account already exists", etc.
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    })
    const [stompClient, setStompClient] = useState(null)
    const navigate = useNavigate()
    const baseURL = "http://192.168.1.118:8080" // modify IP address after install

    function stompConnect() {
        let sock = new SockJS(baseURL + "/ws")
        let stompVar = over(sock) // wraps the SockJS client with STOMP capabilities
        
        stompVar.connect({},                       // headers to send
                         onConnected(stompVar),    // called when STOMP connection is successful
                         (e) => {console.log(e)})  // called when STOMP connection is unsuccessful
    }

    useEffect(() => {
        stompConnect()

        // clean up - disconnect upon component unmount
        return () => {
            if (stompClient) {
                stompClient.disconnect()
            }
        }
    }, [])

    function onConnected(stompVar) {
        setStompClient(stompVar)
    }

    const navigateToChat = () => {
        if (stompClient) {
            navigate("/chatPage", {state: {username: userData.username}})
        }
    }

    function resetInputs() {
        document.getElementById("usernameInput").value = ""
        document.getElementById("passwordInput").value = ""
    }
    
    function verifyFields() {
        if (userData.username === "" || userData.password === "") {
            setInfo("Username or password field must not be empty!")
            resetInputs()
            return false
        }

        return true
    }

    const handleAxio = async(path) => {
        if (!verifyFields()) 
            return

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
                path === "/login" ? setInfo("Incorrect username or password.") : setInfo("Error creating account.")
            }

            resetInputs()
        } catch (error) {
            setInfo("Connection error.")
        }
    }

    function renderInfo() {
        if (info !== "") {
            return <span>{info}</span>
        }
    }

    // - specify button as type="button" to avoid double submission (default browser behavior)
    // - need spread operators for setUserData because otherwise, the unspecified parameter will be set to ""
    return(
        <div className="login-box">
            {renderInfo()}
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
            <div className="buttons">
                <button type="button" onClick={() => {handleAxio("/login")}}>Login</button> 
                <button onClick={() => {handleAxio("/register")}}>Register</button>
            </div>
        </div>
    )
}

export default LoginPage