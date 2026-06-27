import express from "express";
import cors from "cors";
import authRouter from "./auth/auth.js";
import usersRouter from "./routes/users.js";
import platesRouter from "./routes/plates.js";
import ordersRouter from "./routes/orders.js";

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send({
      sucess: true,
      statusCode: 200,
      body: "Welcome to MyGastronomy!",
    });
  });

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
  app.use("/plates", platesRouter);
  app.use("/orders", ordersRouter);

  return app;
}
