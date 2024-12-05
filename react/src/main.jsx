import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="912217324702-i97p4ul4blf9oljho0r0o5i1978uuus4.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
