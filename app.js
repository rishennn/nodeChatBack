const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");
const connectDB = require("./config");

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

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on("disconnect", (socket) => {
		console.log(`User Disconnected: ${socket.id}`);
	})
	
})

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
})()

