const express = require("express");
const router = express.Router();  
const {
  getUsers,
  signUp,
  signIn,
  deleteUser,
} = require("../controllers/userController");
const { roleCheck, validateToken } = require("../common/auth");

router.get("/getUsers",  getUsers);

router.post("/signUp",  signUp);

router.post("/signIn", signIn);

router.delete("/deleteUser",  deleteUser);

module.exports = router;
