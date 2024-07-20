import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'

function ChatPage() {
    const location = useLocation()
    const username = location.state.username
    const [messages, setMessages] = useState([])

    const baseURL = "http://localhost:8080/"

    // const WebSocketComponent = () => {
    //     useEffect(() => {
    //         // Connecting to the WebSocket
    //         const socket = new SockJS('http://localhost:8080/ws');
    //         const stompClient = Stomp.over(socket);
    
    //         stompClient.connect({}, frame => {
    //             console.log('Connected: ' + frame);
    
    //             // Subscribing to a topic
    //             stompClient.subscribe('/topic/messages', message => {
    //                 // Handle received messages
    //                 console.log(JSON.parse(message.body).content);
    //             });
    //         });
    
    //         return () => {
    //             stompClient.disconnect();
    //             console.log("Disconnected");
    //         };
    //     }, []);
    // }

    // continuously fetch all messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(baseURL + "fetchMessages")
                setMessages(response.data)
            } catch (error) {
                console.error("Error fetching messages", error)
            }
        }

        fetchMessages()
    })

    const handleMessageSubmit = async(e) => {
         e.preventDefault()

        const message = document.getElementById("messageInput").value

        // clear message input field
        document.getElementById("messageInput").value = ""

        // only send non-empty messages
        if (message.trim() === "") {
            return
        }

        const send = [username, message]

        try {
            const response = await axios.post(baseURL + "sendAndReceive", send)
            setMessages(response.data)
        } catch (error) {
            console.error("Error sending message", error)
        }
    }

    return(
        <>
            <div className="message-box">
                <ul>
                    {messages.map((data, index) =>
                        <li 
                            key={index}
                            className={data.name === username ? 'my-message' : 'other-message'}>
                            {data.name}: {data.message}
                        </li>
                    )}
                        
                </ul>
            </div>

            <div className="text-box">
                <input type="text" id="messageInput" placeholder="Message..."/>
                <button onClick={handleMessageSubmit}>Send</button>
            </div>
        </>
    )
}

export default ChatPage