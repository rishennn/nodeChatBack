class IndexController {
	async mainPage(req,res,next) {
		try{
			res.json("Server work")
		}catch(e){
			next(e)
		}
	} 
	
}

module.exports = new IndexController