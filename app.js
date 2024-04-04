const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
const indexRouter = require("./routes/index")
const {mongodb} = require("./config")
const DB_URL = mongodb.link

const PORT = 4000;

const app = express();

app.use(express.json())
app.use(cors())

app.use('/', indexRouter);

(async function startApp(){
	try{
		await mongoose.connect(DB_URL)
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	}catch(e){
		console.log(e);
	}
})() 