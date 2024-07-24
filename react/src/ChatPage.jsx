import React, {useState, useEffect} from 'react'
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

    const onError = (e) => {
        console.log(e)
    }

    const hasJoined = async () => {
        try {
            const response = await axios.get(baseURL + "/findMessageWithUsername?username=" + userData.username)
            console.log("hasJoined received: " + response.data)
            
            return response.data
        } catch (error) {
            console.error("Error finding username", error)
            return true
        }
    }

    const userJoin = () => {
        console.log("userJoin called, prevJoin = " + userData.prevJoined)

        if (!userData.prevJoined) {
            var messageToSend = {
                senderName: userData.username,
                content: userData.username + " has joined!",
                status: "JOIN"
            }

            console.log("Message to send: [" + messageToSend.senderName + ", " + messageToSend.content + ", " + messageToSend.status + "]")
    
            stompClient.send("/app/message", {}, JSON.stringify(messageToSend))
        }
        //try {
            //const response = await axios.get(baseURL + "/findMessageWithUsername?username=" + userData.username)
            //console.log("userJoin received: " + response.data)

            // only print join message if it's a new user
        //     if (!response.data) {
        //         var messageToSend = {
        //             senderName: userData.username,
        //             content: userData.username + " has joined!",
        //             status: "JOIN"
        //         }

        //         console.log("Message to send: " + messageToSend)
        
        //         stompClient.send("/app/message", {}, JSON.stringify(messageToSend))
        // }
        // } catch (error) {
        //     console.error("Error finding username", error)
        // }
    }

    const onMessageReceived = (payload) => {
        let payloadData = JSON.parse(payload.body)
        console.log("onMessageReceived received payload [" + payloadData.senderName + ", " + payloadData.content + ", " + payloadData.status + "]")
        var newMessage;

        
        if (payloadData.status === "LEAVE") {
            newMessage = {
                content: payloadData.content,
                status: payloadData.status
            }
        }
        else {
            newMessage = {
                senderName: payloadData.senderName,
                content: payloadData.content,
                status: payloadData.status
            }
        }

        // case where React sends a join message to Spring, but user already joined
        //if (newMessage.status != "JOIN")
        setMessages(prev => [...prev, newMessage])
    }

    const sendMessage = (messageToSend) => {
        console.log("sendMessage received " + messageToSend)
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                content: messageToSend,
                status: 'MESSAGE'
            }

            stompClient.send('/app/message', {}, JSON.stringify(chatMessage))
            setUserData({...userData, "message":""})
        }
    }

    const fetchMessages = async () => {
        try {
            const response = await axios.get(baseURL + "/fetchMessages")
            console.log("fetchMessages received: " + response.data)
            setMessages(response.data)
        } catch (error) {
            console.error("Error fetching messages", error)
        }
    }

    useEffect(() => {
        if (userData.username != null && !isConnected) {
            console.log("/chatpage received username [" + userData.username + "]")
            userConnect()

            // old messages are fetched upon startup
            fetchMessages()
        }

        // ensures useEffect hook is only called once
        return () => { isConnected = true } 
    }, [])

    
    const handleMessageSubmit = async(e) => {
        e.preventDefault()

        const message = document.getElementById("messageInput").value

        // only send non-empty messages
        if (message.trim() === "") {
            return
        }

        setUserData({...userData, "message": message})

        // clear non-empty message input field
        document.getElementById("messageInput").value = ""

        console.log("Sending message: " + message)

        // need to pass message instead of using userData.message because it's not updated yet
        sendMessage(message) 
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

    function navigateToLoginPage() {
        navigate("/loginPage")
    }

    function getMessageClass(data) {
        if (data.status === "JOIN" || data.status === "LEAVE")
            return 'status-message'

        if (data.senderName === userData.username)
            return 'my-message'
        else
            return 'other-message'
    }

    function renderMessage(data) {
        console.log("renderMessage received [" + data.senderName + ", " + data.content + ", " + data.status + "]")
        if (data.status === "MESSAGE")
            return `${data.senderName}: ${data.content}`
        else if (data.status === "JOIN" || data.status === "LEAVE")
            return `${data.content}`
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
        </>
    )
}

export default ChatPage