import express from "express";
import dotenv from "dotenv"
import { chats } from "./data.js";
import { Server } from "socket.io";
import cors from "cors"
import connectDB from "./config/db.js";
import userRouter from "./routers/user.routers.js"
import chatRouter from "./routers/chat.routers.js"
import messageRouter from "./routers/message.routers.js"
import { notFound, errorHandler } from "./middlewares/error.middlewares.js"
dotenv.config({ path: './.env' })
import path from "path"


const app = express()
const PORT = process.env.PORT || 5000
connectDB()

// app.use(cors(
//     {
//         origin: "*",
//         credentials: true
//     }
// ))
app.use(express.json({ limit: "16kb" }))

// app.get("/", (req, res) => {
//     res.send("hello world")
// })

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)

// ----------------------------DEPLOYMENT--------------------------------

const __dirname1 = path.resolve()
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'))
    })
} else {
    app.get("/", (req, res) => {
        res.sendFile("API is running successfully")
    })
}

// ----------------------------DEPLOYMENT--------------------------------

app.use(notFound)
app.use(errorHandler)

const server = app.listen(5000, console.log(`server is running on port ${PORT}`))
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
        // credentials: true
    }
})
io.on("connection", (socket) => {
    // console.log("Connected to socket.io")
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))   

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat
        if (!chat.users) return console.log("chat.users not defined")
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })
})    
