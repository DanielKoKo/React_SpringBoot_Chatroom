import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {over} from 'stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

var stompClient = null

function ChatPage() {
    var isConnected = false
    const location = useLocation()
    const [messages, setMessages] = useState([])
    const [userData, setUserData] = useState({
        username: location.state.username,
        message: ""
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

    const userJoin = () => {
        var messageToSend = {
            senderName: userData.username,
            status: "JOIN"
        }

        stompClient.send("/app/message", {}, JSON.stringify(messageToSend))
    }

    const onMessageReceived = (payload) => {
        console.log("onMessageReceived called")
        let payloadData = JSON.parse(payload.body)
        console.log("Received payload [" + payloadData.senderName + ", " + payloadData.content + ", " + payloadData.status + "]")

        switch(payloadData.status) {
            case "JOIN":

                break
            case "MESSAGE":
                const newMessage = {
                    senderName: payloadData.senderName,
                    content: payloadData.content
                }
                setMessages(prev => [...prev, newMessage])
                break
        }
    }

    const sendMessage = () => {
        console.log("sendMessage called")
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                content: userData.message,
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
            console.log("Current messages: " + messages)
        } catch (error) {
            console.error("Error fetching messages", error)
        }
    }

    useEffect(() => {
        if (userData.username != null && !isConnected) {
            console.log("/chatpage received username [" + userData.username + "]")
            userConnect()
        }

        // old messages are fetched upon startup
        fetchMessages()

        // ensures useEffect hook is only called once
        return () => { isConnected = true } 
    }, [])

    const handleMessageChange = async(e) => {
        const message = document.getElementById("messageInput").value
        setUserData({...userData, "message": message})
    }

    const handleMessageSubmit = async(e) => {
        e.preventDefault()

        // only send non-empty messages
        if (userData.message.trim() === "") {
            return
        }

        console.log("Sending message: " + userData.message)

        // clear message input field
        document.getElementById("messageInput").value = ""

        sendMessage()
    }

    return(
        <>
            <div className="message-box">
                <ul>
                    {messages.map((data, index) =>
                        <li 
                            key={index}
                            className={data.senderName === userData.username ? 'my-message' : 'other-message'}>
                            {data.senderName}: {data.content}
                        </li>
                    )}
                </ul>
            </div>

            <div className="text-box">
                <input type="text" id="messageInput" placeholder="Message..." onChange={handleMessageChange}/>
                <button onClick={handleMessageSubmit}>Send</button>
            </div>
        </>
    )
}

export default ChatPage