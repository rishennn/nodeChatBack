const express = require('express')
const cors = require("cors")
const indexRouter = require("./routes/index")
const connectDB = require("./config");

const app = express();

app.use(express.json())
app.use(cors())

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