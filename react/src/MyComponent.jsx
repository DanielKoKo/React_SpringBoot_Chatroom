import React, {useState, useEffect} from 'react'

function MyComponent() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")

    const baseURL = "http://localhost:8080/"

    const handleMessageSubmit = async(e) => {
         e.preventDefault()

        const newMessage = document.getElementById("messageInput").value

        // only send non-empty messages
        if (newMessage.trim() === "") {
            return
        }

        document.getElementById("messageInput").value = ""

        try {
            // send message to back-end
            const res = await fetch(baseURL + "receiveMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: newMessage
            })

            // receive response from back-end, update list of messages
            setNewMessage(await res.data)
            setMessages(m => [...m, newMessage])
        } catch (error) {
            console.error("Error sending message", error)
        }
    }

    return(
        <>
            <div className="message-box">
                <ul>
                    {messages.map((message, index) =>
                        <li key={index}>{message}</li>)}
                </ul>
            </div>

            <div className="text-box">
                <input type="text" id="messageInput" placeholder="Message..."/>
                <button onClick={handleMessageSubmit}>Send</button>
            </div>
        </>
    )
}

export default MyComponent