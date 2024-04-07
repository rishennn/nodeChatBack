const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/IndexController");
const checkAuth = require("../middleware/authMiddleware");

router.get('/', IndexController.mainPage)
router.post("/register", IndexController.register);
router.post("/login", IndexController.login);

router.get("/allUsers", checkAuth, IndexController.allUsers);
router.get('/oneUser', checkAuth, IndexController.oneUser)

module.exports = router;
