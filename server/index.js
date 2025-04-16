import { Server } from "socket.io";
import { createServer } from "http"; // Import HTTP server
import { Data } from "./Data.js";
import { sockets } from "./sockets.js";

const httpServer = createServer(); // Create an HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let data = new Data();

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  sockets(io, socket, data); // Pass io, socket, and data to the sockets logic
});

const PORT = 3000;
console.log("Starting the server...");
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
