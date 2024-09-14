import React, {useState, useEffect, memo} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import './ChatPage.css'
import {over} from 'stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

let stompClient = null

function ChatPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [tab, setTab] = useState("All") // either "All" or usernames for private chat tab
    const [userData, setUserData] = useState({
        username: location.state.username,
        message: ""
    })

    const baseURL = "http://192.168.1.118:8080" // modify IP address after install

    function stompConnect() {
        let sock = new SockJS(baseURL + "/ws")
        stompClient  = over(sock) // wraps the SockJS client with STOMP capabilities
        
        stompClient.connect({},                    // headers to send
                         onConnected,              // called when STOMP connection is successful
                         (e) => {console.log(e)})  // called when STOMP connection is unsuccessful
    }

    function onConnected() {
        console.log("Web Socket connection successful.")
        stompClient.subscribe('/chatroom/public', onMessageReceived)
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

    // connects user and fetch all messages upon startup
    useEffect(() => {
        if (userData.username != null) {
            console.log("/chatpage received username [" + userData.username + "]")
            stompConnect()
            fetchMessages()
            populateUsers()
        }

        // clean up - unsubscribe and disconnect upon component unmount
        return () => {
            if (stompClient) {
                stompClient.disconnect()
                console.log("WebSocket disconnected successfully")
            }
        }
    }, [])

    function onMessageReceived(payload) {
        let payloadData = JSON.parse(payload.body)
        console.log("onMessageReceived received payload [" + payloadData.senderName + ", " + payloadData.content + ", " + payloadData.status + "]")
        let newMessage = {
            senderName: payloadData.senderName,
            receiverName: payloadData.receiverName,
            content: payloadData.content,
            status: payloadData.status
        }

        if (newMessage.status === "JOIN") {
            setUsers(prevUsers => [...prevUsers, newMessage.senderName])
        }

        // only add message if it's public or current user's private
        if (newMessage.senderName === userData.username || newMessage.receiverName === userData.username || newMessage.receiverName === "All")
            setMessages(prev => [...prev, newMessage])
    }

    function sendMessage(messageToSend) {
        console.log("sendMessage received " + messageToSend)

        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                receiverName: tab,
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

            setMessages(response.data)
        } catch (error) {
            console.error("Error fetching messages", error)
        }
    }

    function handleTabChange(user) {
        console.log("handleTabChange received: " + user)

        // checks if we're clicking on current tab
        if (user !== tab)
            setTab(user)
    }

    function getTabClass(user) {
        console.log("getTabClass received: ", user)
        return user === tab ? "selected-user" : "unselected-user"
    }

    
    const handleMessageSubmit = async(e) => {
        e.preventDefault()

        const message = document.getElementById("messageInput").value

        // only send non-empty messages
        if (message.trim() != "") {
            setUserData({...userData, "message": message})

            // clear non-empty message input field
            document.getElementById("messageInput").value = ""
    
            console.log("Sending message: " + message)
    
            // need to pass message instead of using userData.message because it's not updated yet
            sendMessage(message) 
        }
    }

    function handleExit() {
        var messageToSend = {
            senderName: userData.username,
            content: "",
            status: "LEAVE"
        }

        stompClient.send("/app/message", {}, JSON.stringify(messageToSend))
        navigateToLoginPage()
    }

    const navigateToLoginPage = () => { navigate("/") }

    function getMessageClass(data) {
        if (data.status === "JOIN" || data.status === "LEAVE")
            return 'status-message'

        return data.senderName === userData.username ? "my-message" : "other-message"
    }

    function renderUsername(data) {
        if (data.status === "MESSAGE") {
            return <span className={(data.senderName === userData.username) ? "my-username" : "other-username"}>{data.senderName}</span>
        }
    }

    function renderMessage(data) {
        console.log("renderMessage received [" + data.senderName + ", " + data.receiverName + ", " + data.content + ", " + data.status + "]")

        // public message
        if (tab === "All" && data.receiverName === "All") {
            return data.content
        }
        // private message
        else if ((tab == data.senderName || tab == data.receiverName) && (data.receiverName === userData.username || data.senderName === userData.username)) {
            return data.content
        }
    }

    return(
        <>
            <div className="frame">
                <div className="users-frame">
                    <ul>
                        <li key={"All"} className={getTabClass("All")} onClick={() => {handleTabChange("All")}}>All</li>
                        {users.map((user, index) => {
                                if (user != userData.username) {
                                    return <li key={index}
                                               className={getTabClass(user)}
                                               onClick={() => {handleTabChange(user)}}>
                                               {user}
                                            </li>    
                                }
                            }
                        )}
                    </ul>
                </div>

                <div className="message-frame">
                    <div className="message-box">
                        <ul>
                            {messages.map((message, index) => {
                                if (renderMessage(message)) {
                                    return (<>
                                                {renderUsername(message)}
                                                <li key={index}
                                                className={getMessageClass(message)}>
                                                {renderMessage(message)}
                                                </li>
                                            </>)
                                }}
                            )}
                        </ul>
                    </div>

                    <div className="message-input-box">
                        <input type="text" id="messageInput" placeholder="Message..."/>
                        <button onClick={handleMessageSubmit}>Send</button>
                    </div>
                    <div className="bottom-tab">
                        <button onClick={navigateToLoginPage}>Leave Chat</button>
                        <button onClick= {() => {if (window.confirm("This action will delete your account and cannot be reversed!")) handleExit()}}>Delete Account</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(ChatPage)