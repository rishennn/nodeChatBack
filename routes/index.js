const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/IndexController");
const checkAuth = require("../middleware/authMiddleware");

router.post("/register", IndexController.register);
router.post("/login", IndexController.login);
router.get("/users", checkAuth, IndexController.mainPage);

module.exports = router;
