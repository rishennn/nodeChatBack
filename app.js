const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");
const connectDB = require("./config");

const ChatModels = require("./services/ChatModels");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("create_chat", async (data) => {
    const database = await ChatModels.createChat({
      name: data.name,
      online: 0,
      roomId: Date.now(),
      author: data.author,
      messages: [],
    });
    io.emit("receive_chats", database);
  });

  socket.on("get_all_chats", async () => {
    const allChats = await ChatModels.getChats();
    socket.emit("receive_chats", allChats);
  });

  socket.on("join_chat", async (roomId) => {
    socket.leaveAll();
    socket.join(roomId);
    changeOnline();
    const database = await ChatModels.getChat({
      roomId: roomId,
    });
    socket.emit("receive_message", database);
    if (io.sockets.adapter.rooms.get(roomId)) {
      console.log(">>>>>>", io.sockets.adapter.rooms.get(roomId));
      // await ChatModels.changeOnline(
      //   {roomId},
      //   io.sockets.adapter.rooms.get(roomId).size
      // );
      changeOnline();
      const chats = await ChatModels.getChats();
      socket.emit("receive_chats", chats);
    }
  });

  socket.on("disconnect", () => {
    changeOnline();
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const { DATABASE_URI, PORT } = process.env;

(async function startServer() {
  try {
    await connectDB(DATABASE_URI);
    app.use("/", indexRouter);
    server.listen(PORT || 3500, () =>
      console.log(`Server started on port ${PORT || 3500}`)
    );
  } catch (e) {
    console.log(e);
  }
})();

async function changeOnline() {
  const chats = await ChatModels.getChats();
  for (let i = 0; i < chats.length; i++) {
    if (io.sockets.adapter.rooms.get(chats[i].roomId)) {
      await ChatModels.changeOnline(
        { roomId: chats[i].roomId },
        io.sockets.adapter.rooms.get(chats[i].roomId).size
      );
    } else {
      await ChatModels.changeOnline({ roomId: chats[i].roomId }, 0);
    }
  }
}
