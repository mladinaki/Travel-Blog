const { Server } = require("socket.io");
let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"],
            methods: ["GET", "POST"],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on("connection", (socket) => {
        socket.on("disconnect", () => {
            console.log("Потребителят се е изключил." , socket.id);
            
        });

        socket.on("newPost", (post) => {
            io.emit("newPost", post);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io не е инициализиран!");
    }
    return io;
};

module.exports = { initializeSocket, getIO };
