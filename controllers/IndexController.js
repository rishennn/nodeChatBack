const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { UsersModel } = require("../models/users.model");

const genToken = (id) => {
  return jwt.sign({id}, SECRET_KEY, { expiresIn: "24h" });
};

class IndexController {
  async mainPage(req, res, next) {
    try {
      res.json("Server work");
    } catch (e) {
      next(e);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      const checkEmail = await UsersModel.findOne({ email });

      if (checkEmail) {
        return res
          .status(400)
          .json({ message: "This address is already registered." });
      }

      if (password !== confirmPassword) {
        return res.status(422).json({ message: "Password mismatch." });
      }

      const hashedPassword = await bcrypt.hash(password, 5);

      const newUser = await UsersModel.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(200).json({
        message: "The user has been successfully registered!",
      });
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UsersModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "No such address exists." });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ message: "The password was entered incorrectly." });
      }

      const token = await genToken(user._id);
      return res.json({ token });
    } catch (e) {
      console.log(e);
    }
  }
  async allUsers(req, res, next) {
    try {
      const users = await UsersModel.find({});
      res.json(users);
    } catch (e) {
      next(e);
    }
  }
  async oneUser(req, res, next) {
    try {
      const { authorization } = req.headers;
			const token = authorization.split(" ")[1];
      const {id} = jwt.decode(token, SECRET_KEY);
      const user = await UsersModel.findById(id);
      res.status(200).json({
        name: user.name,
				id: user._id
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new IndexController();
