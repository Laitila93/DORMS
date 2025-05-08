import { io, Socket } from 'socket.io-client';
import { useShopData } from './useShopData';

let socket: Socket | null = null;
const serverIP = sessionStorage.getItem("serverIP") || "https://dorms-server.onrender.com";
export function connectSocket(token: string) {
  if (socket) {
    socket.disconnect();
  }
    if (!token) {
        console.error("No auth token found in local storage.");
        return;
    }
  socket = io(serverIP, {
    auth: { token },
    transports: ['websocket']
  });
  useShopData(socket); // Call the useShopData function to fetch shop data
  console.log("Socket connected to server:", serverIP);
  return socket;
}

export function getSocket(): Socket {
    if (!socket){
        socket = io(serverIP);
    }
    return socket;
  }
  
