const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

let checkAuth = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(403).json({ message: "You are not authorized." });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token not found." });
    }

    const data = jwt.verify(token, SECRET_KEY);
    req.user = data;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Authorisation Error." });
  }
};

module.exports = checkAuth;
