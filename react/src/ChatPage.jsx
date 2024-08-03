import React, {useState, useEffect, memo} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import {over} from 'stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

var stompClient = null
function ChatPage() {
    var isConnected = false
    const location = useLocation()
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [userData, setUserData] = useState({
        username: location.state.username,
        message: "",
        prevJoined: location.state.prevJoined
    })

    const baseURL = "http://localhost:8080"

    const userConnect = () => {
        let sock = new SockJS(baseURL + "/ws")
        stompClient = over(sock) // wraps the SockJS client with STOMP capabilities
        
        stompClient.connect({},          // headers to send
                            onConnected, // called when STOMP connection is successful
                            onError)     // called when STOMP connection is unsuccessful
    }

    const onConnected = () => {
        console.log("Web Socket connection successful.")
        stompClient.subscribe('/chatroom/public', onMessageReceived)
        userJoin()
    }

    const onError = (e) => { console.log(e) }

    const userJoin = () => {
        console.log("userJoin called, prevJoin = " + userData.prevJoined)

        if (!userData.prevJoined) {
            var messageToSend = {
                senderName: userData.username,
                status: "JOIN"
            }

            console.log("Message to send: [" + messageToSend.senderName + ", " + messageToSend.content + ", " + messageToSend.status + "]")
    
            stompClient.send("/app/message", {}, JSON.stringify(messageToSend))
        }
    }

    const populateUsers = async() => {
        try {
            const response = await axios.get(baseURL + "/getUsers")
            console.log("populateUsers received: " + response.data)
            setUsers(response.data)
        } catch (error) {
            console.error("Error populating users", error)
        }
    }

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body)
        console.log("onMessageReceived received payload [" + payloadData.senderName + ", " + payloadData.content + ", " + payloadData.status + "]")
        var newMessage;
        
        newMessage = {
            senderName: payloadData.senderName,
            receiverName: payloadData.receiverName,
            content: payloadData.content,
            status: payloadData.status
        }

        // only add message if it's public or current user's private
        if (newMessage.senderName === userData.username || newMessage.receiverName === userData.username || newMessage.receiverName === "All")
            setMessages(prev => [...prev, newMessage])
    }

    const sendMessage = (messageToSend) => {
        console.log("sendMessage received " + messageToSend)

        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                receiverName: document.getElementById("privateMessageDropdown").value,
                content: messageToSend,
                status: 'MESSAGE'
            }

            console.log("sendMessage sending [" + chatMessage.senderName + ", " + chatMessage.receiverName + ", " + chatMessage.content + ", " + chatMessage.status + "]")
            stompClient.send('/app/message', {}, JSON.stringify(chatMessage))
            setUserData({...userData, "message":""})
        }
    }

    const fetchMessages = async () => {
        try {
            console.log("fetchMessages sending username " + userData.username)
            const response = await axios.get(baseURL + "/fetchMessages?username=" + userData.username)
            console.log("fetchMessages received: " + response.data)

            setMessages(response.data)
        } catch (error) {
            console.error("Error fetching messages", error)
        }
    }

    // connects user and fetch all messages upon startup
    useEffect(() => {
        if (userData.username != null && !isConnected) {
            console.log("/chatpage received username [" + userData.username + "]")
            userConnect()
            fetchMessages()
            populateUsers()
        }

        // ensures useEffect hook is only called once
        return () => { isConnected = true } 
    }, [])

    
    const handleMessageSubmit = async(e) => {
        e.preventDefault()

        const message = document.getElementById("messageInput").value

        // only send non-empty messages
        if (message.trim() != "") {
            setUserData({...userData, "message": message})

            // clear non-empty message input `fi`eld
            document.getElementById("messageInput").value = ""
    
            console.log("Sending message: " + message)
    
            // need to pass message instead of using userData.message because it's not updated yet
            sendMessage(message) 
        }
    }

    const handleExit = () => {
        var messageToSend = {
            senderName: userData.username,
            content: "",
            status: "LEAVE"
        }

        stompClient.send("/app/message", {}, JSON.stringify(messageToSend))
        navigateToLoginPage()
    }

    const navigateToLoginPage = () => { navigate("/") }

    const getMessageClass = (data) => {
        if (data.status === "JOIN" || data.status === "LEAVE")
            return 'status-message'

        if (data.senderName === userData.username) {
            return (data.receiverName != "All") ? 'my-private-message' : 'my-message'
        }
        else {
            return (data.receiverName != "All") ? 'other-private-message' : 'other-message'
        }
    }

    const renderMessage = (data) => {
        console.log("renderMessage received [" + data.senderName + ", " + data.receiverName + ", " + data.content + ", " + data.status + "]")
        if (data.status === "MESSAGE")
            return `${data.senderName}: ${data.content}`
        else if (data.status === "JOIN" || data.status === "LEAVE")
            return `${data.content}`

        return null
    }

    return(
        <>
            <div className="message-box">
                <ul>
                    {messages.map((data, index) =>
                        <li 
                            key={index}
                            className={getMessageClass(data)}>
                            {renderMessage(data)}
                        </li>
                    )}
                </ul>
            </div>

            <div className="text-box">
                <input type="text" id="messageInput" placeholder="Message..."/>
                <button onClick={handleMessageSubmit}>Send</button>
            </div>

            <button onClick={navigateToLoginPage}>Leave Chat</button>
            <button onClick= {() => {if (window.confirm("This action will delete your account and cannot be reversed!")) handleExit()}}>Delete Account</button>
            <select id="privateMessageDropdown">
                    <option value={"All"}>Send message to all</option>
                    {users.map((user, index) => {
                        if (user != userData.username) {
                            return (
                                <option key={index} value={user}>
                                    Send message to {user}
                                </option>
                            )
                        }
                    })}
            </select>
        </>
    )
}

export default memo(ChatPage)