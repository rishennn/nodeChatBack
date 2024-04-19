const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");
const connectDB = require("./config");

const ChatModels = require("./services/ChatModels")

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
      idRoom: Date.now(),
      author: data.author,
      data: [],
    });
		console.log("database", database);
    io.emit("receive_chats", database);
  });

	// socket.on("send-message", (data) => {
	// 	console.log(data);
	// })

  socket.on("disconnect", () => {
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
