import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from "../database/mongo.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const collectionName = "users";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, callback) => {
      try {
        const user = await Mongo.db
          .collection(collectionName)
          .findOne({ email: email });

        if (!user) {
          return callback(null, false);
        }

        // Garanta que você está acessando o buffer do salt corretamente de acordo com como salvou
        const saltBuffer = user.salt.buffer
          ? Buffer.from(user.salt.buffer)
          : Buffer.from(user.salt);

        crypto.pbkdf2(
          password,
          saltBuffer,
          310000,
          16,
          "sha256",
          (err, hashedPassword) => {
            if (err) {
              return callback(err);
            }

            const userPasswordBuffer = Buffer.from(user.password.buffer);

            // A checagem precisa ser FEITA AQUI DENTRO do callback
            if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
              return callback(null, false);
            }

            // Mudamos o nome para 'userPassword' para não dar conflito com o 'password' do argumento
            const { password: userPassword, salt, ...rest } = user;

            return callback(null, rest);
          },
        );
      } catch (error) {
        return callback(error);
      }
    },
  ),
);

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body; // <--- Corrigido: pegando do req.body

  const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({ email });

  if (checkUser) {
    return res.status(400).send({
      // 400 ou 409 é melhor que 500 para usuário já existente
      success: false,
      statusCode: 400,
      body: {
        text: "User already exists!",
      },
    });
  }

  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    password,
    salt,
    310000,
    16,
    "sha256",
    async (err, hashedPassword) => {
      if (err) {
        return res.status(500).send({
          success: false,
          statusCode: 500,
          body: {
            text: "Error on crypto password!",
            err: err,
          },
        });
      }

      const result = await Mongo.db.collection(collectionName).insertOne({
        email: email,
        password: hashedPassword,
        salt,
      });

      if (result.insertedId) {
        const user = await Mongo.db
          .collection(collectionName)
          .findOne({ _id: new ObjectId(result.insertedId) });

        // Removendo dados sensíveis antes de gerar o token e enviar na resposta
        const {
          password: userPassword,
          salt: userSalt,
          ...userWithoutSecrets
        } = user;

        // Ideal usar uma variável de ambiente em produção em vez de "secret"
        const token = jwt.sign(userWithoutSecrets, "secret");

        return res.send({
          success: true,
          statusCode: 200,
          body: {
            text: "User created successfully!",
            token,
            user: userWithoutSecrets,
            logged: true,
          },
        });
      }
    },
  );
});

export default authRouter;
