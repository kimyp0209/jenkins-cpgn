import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
// index.js 또는 App.js 상단에 추가
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="350910293343-n8kikmcpil8elab2nff0m0av47mtet1s.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);