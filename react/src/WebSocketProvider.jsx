import React, {useState, useEffect, createContext} from 'react'
import './LoginPage.css'
import SockJS from 'sockjs-client/dist/sockjs'
import {over} from 'stompjs'

export const WebSocketContext = createContext()

function WebSocketProvider({children}) {
    const [stompClient, setStompClient] = useState(null)
    const baseURL = "http://xxx.xxx.x.xxx:8080"

    useEffect(() => {
        let sock = new SockJS(baseURL + "/ws")
        let stompVar = over(sock) // wraps the SockJS client with STOMP capabilities
        
        stompVar.connect({},                       // headers to send
                         onConnected(stompVar),    // called when STOMP connection is successful
                         (e) => {console.log(e)})  // called when STOMP connection is unsuccessful
    }, [])

    function onConnected(stompVar) {
        console.log("Web Socket connection successful.")
        setStompClient(stompVar)
    }

    return (
        <WebSocketContext.Provider value={stompClient}>
            {children}
        </WebSocketContext.Provider>
    )
}

export default WebSocketProvider
