const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require("socket.io");
const indexRouter = require("./routes/index")
const connectDB = require("./config");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173" || "http://localhost:5174",
//     methods: ["GET", "POST", "DELETE", "PUT"],
//   },
// });

app.use(express.json())
app.use(cors())

io.on("connection", (socket) => {
    console.log("Socket connected : " + socket.id);

    // socket.on("register", async () => {
    //     const database = await ChatModels.getChats();
    //     socket.timeout(1000).emit("receive_chats", database);
    // })//+

    // socket.on("create_chat", async (data) => {
    //     const database = await ChatModels.createChat({
    //         name: data.name,
    //         online: 0,
    //         idRoom: Date.now(),
    //         author: data.author,
    //         data: []
    //     });
    //     io.emit("receive_chats", database);
    // })//+

    // socket.on("join_chat", async (data) => {
    //     const database = await ChatModels.getChat({
    //         idRoom: data.roomInfo.idRoom});
    //     socket.join(data.roomInfo.idRoom);
    //     socket.timeout(1000).emit('receive_message', database);
    //     if (io.sockets.adapter.rooms.get(data.roomInfo.idRoom)) {
    //         await ChatModels.changeOnline({idRoom: data.roomInfo.idRoom}, io.sockets.adapter.rooms.get(data.roomInfo.idRoom).size)
    //         const dataBas = await ChatModels.getChats();
    //         socket.broadcast.emit('receive_chats', dataBas);
    //     }
    // })

    // socket.on("receive_messages", async (data) => {
    //     const database = await ChatModels.getChat({idRoom: data.roomInfo.idRoom});
    //     socket.emit("receive_message", database);
    // })

    // socket.on("send_message", async (data) => {
    //     const database = await ChatModels.addMessage({idRoom: data.idRoom}, {
    //         author: {
    //             name: socket.handshake.auth.name,
    //             id: socket.handshake.auth.id
    //         }, message: data.message, date: data.date
    //     });
    //     io.to(data.idRoom).emit('receive_message', database);
    //     io.emit("receive_chats", await ChatModels.getChats());
    // });

    // socket.on("writed_message", (data) => {
    //     socket.broadcast.to(data.roomInfo.idRoom).emit("writed_loader_active", socket.handshake.auth.name);
    // });

    // socket.on("unwrited_message", (data) => {
    //     socket.broadcast.to(data.roomInfo.idRoom).emit("writed_loader_deactive", socket.handshake.auth.name);
    // });

    // socket.on("disconnect", async () => {
    //     const databases = await ChatModels.getChats();
    //     for (let i = 0; i < databases.length; i++) {
    //         if (io.sockets.adapter.rooms.get(databases[i].idRoom)) {
    //             await ChatModels.changeOnline({idRoom: databases[i].idRoom}, io.sockets.adapter.rooms.get(databases[i].idRoom).size);
    //         } else {
    //             await ChatModels.changeOnline({idRoom: databases[i].idRoom}, 0);
    //         }
    //     }
    //     const database = await ChatModels.getChats();
    //     io.emit("receive_chats", database);
    //     console.log("Disconnected : " + socket.id);
    // })
});

const { DATABASE_URI, PORT } = process.env;
connectDB(DATABASE_URI)

app.use('/', indexRouter);

(async function startApp(){
	try{
		app.listen(PORT || 3500, () => console.log(`Server started on port ${PORT || 3500}`))
	}catch(e){
		console.log(e);
	}
})() 