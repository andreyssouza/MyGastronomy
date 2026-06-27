import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongo.js";
import { config } from "dotenv";
import { createApp } from "./app.js";

config();

async function main() {
  const port = process.env.PORT || 3000;
  const connectionString = process.env.MONGO_CS;
  const dbName = process.env.MONGO_DB_NAME;

  if (!connectionString) {
    console.error("ERRO CRÍTICO: A variável MONGO_CS não foi definida no ambiente!");
    process.exit(1);
  }

  const mongoConnection = await Mongo.connect({
    mongoConnectionString: connectionString,
    mongoDbName: dbName,
  });
  console.log(mongoConnection);

  const app = createApp();

  app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
}

main();
