import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from "../database/mongo.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { validateLogin, validateSignup } from "../helpers/validators.js";

const collectionName = "users";

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, callback) => {
    const user = await Mongo.db.collection(collectionName).findOne({ email: email });

    if (!user) {
      return callback(null, false);
    }

    const saltBuffer = Buffer.from(user.salt.buffer);

    crypto.pbkdf2(password, saltBuffer, 310000, 16, "sha256", (err, hashedPassword) => {
      if (err) {
        return callback(err);
      }

      const userPasswordBuffer = Buffer.from(user.password.buffer);

      if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
        return callback(null, false);
      }

      const { password, salt, ...rest } = user;

      return callback(null, rest);
    });
  }),
);

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // ✅ VALIDAR input
  const { error, value } = validateSignup(req.body);
  if (error) {
    return res.status(400).send({
      success: false,
      statusCode: 400,
      body: {
        text: "Validation error",
        errors: error.details.map((err) => err.message),
      },
    });
  }

  const checkUser = await Mongo.db.collection(collectionName).findOne({ email: value.email });

  if (checkUser) {
    return res.status(400).send({
      success: false,
      statusCode: 400,
      body: {
        text: "User already exists",
      },
    });
  }

  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(value.password, salt, 310000, 16, "sha256", async (err, hashedPassword) => {
    if (err) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: {
          text: "Error on crypto password",
        },
      });
    }

    const result = await Mongo.db.collection(collectionName).insertOne({
      fullname: value.fullname,
      email: value.email,
      password: hashedPassword,
      salt,
    });

    if (result.insertedId) {
      const user = await Mongo.db.collection(collectionName).findOne({ _id: new ObjectId(result.insertedId) });

      const token = jwt.sign(user, process.env.JWT_SECRET || "secret");

      return res.send({
        success: true,
        statusCode: 200,
        body: {
          text: "User registered correctly!",
          token,
          user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
          },
          logged: true,
        },
      });
    }
  });
});

authRouter.post("/login", (req, res) => {
  // ✅ VALIDAR input
  const { error, value } = validateLogin(req.body);
  if (error) {
    return res.status(400).send({
      success: false,
      statusCode: 400,
      body: {
        text: "Validation error",
        errors: error.details.map((err) => err.message),
      },
    });
  }

  passport.authenticate("local", (authError, user) => {
    if (authError) {
      return res.status(500).send({
        success: false,
        statusCode: 500,
        body: {
          text: "Error during authentication",
        },
      });
    }

    if (!user) {
      return res.status(400).send({
        success: false,
        statusCode: 400,
        body: {
          text: "Invalid email or password",
        },
      });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET || "secret");
    return res.status(200).send({
      success: true,
      statusCode: 200,
      body: {
        text: "User logged in correctly",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
        token,
      },
    });
  })(req, res);
});

export default authRouter;
