const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const secKey = "asdfghjklmnbvcxz ";
const FE_URL = "http://localhost:3000";

let hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRounds);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

let comparePassword = async (hashedPassword, password) => {
  return await bcrypt.compare(hashedPassword, password);
};

let createToken = async (payload, expiryTime = "120m") => {
  return await jwt.sign(payload, secKey, { expiresIn: expiryTime });
};

let validateToken = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let token = req.headers.authorization.split(" ")[1];
      let data = await jwt.decode(token);
      let currentTime = Math.floor(+Date.now() / 1000);

      if (currentTime < data.exp) {
        next();
      } else {
        res.status(403).send({ message: "Token Has Expired, Login Again." });
      }
    } else {
      res.status(400).send({ message: "Missing authorization credentials." });
    }
  } catch (error) {
    console.log("error message", error.message);
    res.status(400).send({ message: "Unauthorized: Invalid token" });
  }
};

let roleCheck = (requiredRole) => {
  try {
    return async (req, res, next) => {
      
      const rolesHierarchy = {
        superAdmin: ["superAdmin", "admin"],
        admin: ["admin"],
      };
      
      if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        let data = await jwt.decode(token);

        if (
          rolesHierarchy[data.role] &&
          rolesHierarchy[data.role].includes(requiredRole)
        ) {
          next();
        } else {
          res.status(403).send({
            message: `Access denied: User does not meet the required role.`,
          });
        }
      } else {
        res.status(400).send({ message: "Credentials Missing" });
      }
    };
  } catch (error) {
    console.log("error message", error.message);
    res.status(400).send({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  FE_URL,
  hashPassword,
  comparePassword,
  createToken,
  validateToken,
  roleCheck,
};
