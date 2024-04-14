const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const indexRouter = require("./routes/index");
const connectDB = require("./config");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected : " + socket.id);
});

const { DATABASE_URI, PORT } = process.env;

(async function startServer() {
  try {
    await connectDB(DATABASE_URI);
    app.use("/", indexRouter);
    app.listen(PORT || 3500, () =>
      console.log(`Server started on port ${PORT || 3500}`)
    );
  } catch (e) {
    console.log(e);
  }
})()

