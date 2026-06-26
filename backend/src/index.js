import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongo.js";
import { config } from "dotenv";
import authRouter from "./auth/auth.js";
import usersRouter from "./routes/users.js";
import platesRouter from "./routes/plates.js";
import ordersRouter from "./routes/orders.js";

// Inicializa o dotenv (importante para rodar localmente)
config();

async function main() {
  // No Azure, o hostname não deve ser engessado como "localhost",
  // deixe apenas a porta dinâmica que o Azure te fornece.
  const port = process.env.PORT || 3000;

  const app = express();

  // Pegando as variáveis de ambiente com um Fallback (plano B) caso dê algum erro de leitura
  const connectionString = process.env.MONGO_CS;
  const dbName = process.env.MONGO_DB_NAME;

  if (!connectionString) {
    console.error("ERRO CRÍTICO: A variável MONGO_CS não foi definida no ambiente!");
    process.exit(1); // Para a aplicação com erro em vez de capotar com 'startsWith'
  }

  const mongoConnection = await Mongo.connect({
    mongoConnectionString: connectionString,
    mongoDbName: dbName,
  });
  console.log(mongoConnection);

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

  // Removido o hostname do listen para que o Azure consiga fazer o Bind correto da porta interna
  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

main();
