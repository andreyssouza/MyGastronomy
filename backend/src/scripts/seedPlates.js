import { config } from "dotenv";
import { readFile } from "fs/promises";
import { Mongo } from "../database/mongo.js";

config();

async function seedPlates() {
  await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CS,
    mongoDbName: process.env.MONGO_DB_NAME,
  });

  const data = JSON.parse(
    await readFile(new URL("../data/platesData.json", import.meta.url)),
  );

  const collection = Mongo.db.collection("plates");

  await collection.deleteMany({});
  const result = await collection.insertMany(data);

  console.log(`Inseridos ${result.insertedCount} pratos na coleção "plates".`);

  await Mongo.client.close();
  process.exit(0);
}

seedPlates().catch((error) => {
  console.error("Erro ao popular o banco:", error);
  process.exit(1);
});
