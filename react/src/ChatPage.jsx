import React, {useState, useEffect} from 'react'
import axios from 'axios'

function ChatPage() {
    const [messages, setMessages] = useState([])

    const baseURL = "http://localhost:8080/"

    // fetch all messages on startup
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
    }, [])

    const handleMessageSubmit = async(e) => {
         e.preventDefault()

        const message = document.getElementById("messageInput").value

        // clear message input field
        document.getElementById("messageInput").value = ""

        // only send non-empty messages
        if (message.trim() === "") {
            return
        }

        const name = document.getElementById("nameInput").value
        const nameToSend = (name.trim() === "") ? "N/A" : name
        const send = [nameToSend, message]

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
                        <li key={index}>{data.name}: {data.message}</li>)}
                </ul>
            </div>

            <div className="text-box">
                <input type="text" id="nameInput" placeholder="Name"/>
                <input type="text" id="messageInput" placeholder="Message..."/>
                <button onClick={handleMessageSubmit}>Send</button>
            </div>
        </>
    )
}

export default ChatPage