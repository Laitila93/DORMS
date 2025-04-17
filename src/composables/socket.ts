import { io } from 'socket.io-client';
sessionStorage.setItem("serverIP", `https://dorms-server.onrender.com`);
const serverIP = sessionStorage.getItem("serverIP") || "https://dorms-server.onrender.com:3000";
export const socket = io(serverIP);