const {
  hashPassword,
  comparePassword,
  createToken,
  FE_URL,
} = require("../common/auth");
const { SendEmail } = require("../common/mailsender");
const { getErrorMessages } = require("../common/utils");
const { userModel } = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    let userss = users.map((d) => {
      let asd = d.toObject()
      delete asd.password; 
      return asd;
    });
    res.status(200).send({ message: "ds Fetched Successfully", userss });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      errors: getErrorMessages(error),
    });
  }
};

const signUp = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      req.body.password =
        req.body.password && (await hashPassword(req.body.password)); 
      let user = (await userModel.create(req.body)).toObject();
      delete user.password;
      const token = await createToken({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      res.status(201).send({
        message:
          "User created successfully! we've sent you a confirmation email.",
        user,
        token,
      });

      let name = user.name;
      let email = user.email;
      await SendEmail(email, name, "Your Account Has Been Created");
    } else {
      res.status(400).send({ message: "User Already Exists" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Missing Fields.", errors: getErrorMessages(error) });
    }

    console.error("Error creating category:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      errors: getErrorMessages(error),
    });
  }
};

const signIn = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    let isPassValid =
      user && (await comparePassword(req.body.password, user.password));
    let userActivated = user && user.isActivated;

    if (user && isPassValid) {
      const token = await createToken({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      if (!userActivated) {
        let url = `${FE_URL}/signInActivationMail/${token}`;
        let name = user.name;
        let email = user.email;
        await SendEmail(
          email,
          url,
          "Activate Your Account",
          name,
          "Activate Your Account"
        );

        return res.status(400).send({
          message:
            "Account Is Not Activated, An Activation Email Has Been Sent To Your Email Id.",
        });
      }
      user = user.toObject();
      delete user.password;
      return res
        .status(200)
        .send({ message: "User Logged In Sucessfully.", user, token });
    } else {
      res
        .status(400)
        .send({ message: user ? "Invaid Password." : "User Doesn't Exist." });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Missing Fields.", errors: getErrorMessages(error) });
    }

    console.error("Error creating category:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      errors: getErrorMessages(error),
    });
  }
};

let forgetPassword = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    let isPassValid =
      user && (await comparePassword(req.body.password, user.password));

    if (user && isPassValid) {
      const token = await createToken({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      let url = `${FE_URL}/forgetPassword/${token}`;
      let name = user.name;
      let email = user.email;
      await SendEmail(
        email,
        url,
        "Reset Your Password",
        name,
        "Reset Your Password"
      );

      return res.status(200).send({
        message: "Reset Password Link Has Been Sent To Your Email Id.",
        user,
        token,
      });
    } else {
      res
        .status(400)
        .send({ message: user ? "Invaid Password." : "User Doesn't Exist." });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Missing Fields.", errors: getErrorMessages(error) });
    }

    console.error("Error creating category:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      errors: getErrorMessages(error),
    });
  }
};

let deleteUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const deletedUser = await userModel.deleteOne({ email: req.body.email });
      res
        .status(204)
        .send({ message: "Users Deleted Sucessfully.", deletedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .send({ message: "Missing Fields.", errors: getErrorMessages(error) });
    }

    console.error("Error creating category:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      errors: getErrorMessages(error),
    });
  }
};

module.exports = { getUsers, signUp, signIn, forgetPassword, deleteUser };
