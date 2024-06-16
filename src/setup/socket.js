const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { instrument } = require("@socket.io/admin-ui");

app.use(cors());

const server = http.createServer(app)

const PORT = 3000
const io = new Server(server, {
    cors: {
        origin: [
            "https://admin.socket.io",
            "http://localhost:3000",
            "http://localhost:5173",
        ],
        credentials: true,
        methods: ["GET", "POST"],
    }
})

instrument(io, {
    auth: false,
    mode: "development",
});

io.on("connection", (socket) => {
    console.log(`🌞: ${socket.id} user just connected!`);

    socket.on('join-room', (nhom) => {
        socket.join(nhom);
        if (nhom === 3)
            console.log(`🚀 ~ ${socket.id} đã tham gia phòng Khách hàng`);
        if (nhom === 2)
            console.log(`🚀 ~ ${socket.id} đã tham gia phòng Nhân viên`);
        if (nhom === 1)
            console.log(`🚀 ~ ${socket.id} đã tham gia phòng Quản lý`);
    })

    socket.on('create-saving', (SoTK) => {
        setTimeout(() => {
            io.to(2).emit('new-saving', SoTK);
        }, 2000)
    });

    socket.on('disconnect', () => {
        socket.disconnect()
        console.log(`🔥: ${socket.id} disconnected`);
    });
})

server.listen(PORT, () => {
    console.log("🚀 ~ SERVER IS RUNNING ON PORT ", PORT);
})