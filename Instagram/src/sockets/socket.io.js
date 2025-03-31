import { Server } from "socket.io";
 
 
 function initSocket(server) {
 
     console.log("Socket.io initialized")
 
     const io = new Server(server)
 
     io.on("connection", (socket) => {
         console.log("User connected")
     })
 
 }
 
 
 export default initSocket;