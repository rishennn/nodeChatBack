const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { UsersModel } = require("../models/users.model");

const genToken = (email, password) => {
  const myToken = {
    email,
    password,
  };
  return jwt.sign(myToken, SECRET_KEY, { expiresIn: "24h" });
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
          .json({ message: "Данный адрес уже зарегистрирован." });
      }

      if (password !== confirmPassword) {
        return res.status(422).json({ message: "Пароли не совпадают." });
      }

      const hashedPassword = await bcrypt.hash(password, 5);

      const newUser = new UsersModel({
        name,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      await newUser.save();
      return res.json({ message: "Пользователь успешно зарегистрирован!" });
    } catch (e) {
      console.log(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UsersModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Такого адреса не существует." });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Пароль введён неправильно." });
      }

      const token = await genToken(user.email, user.password);
      return res.json({ token });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new IndexController();
