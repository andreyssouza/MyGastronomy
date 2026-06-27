import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongo } from "../src/database/mongo.js";
import { createApp } from "../src/app.js";

let mongod;
let app;

describe("Plates routes - with MongoDB in memory", () => {
  beforeAll(async () => {
    // Inicia um MongoDB em memória para os testes
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    // Conecta ao Mongo em memória
    await Mongo.connect({
      mongoConnectionString: uri,
      mongoDbName: "testdb",
    });

    app = createApp();
  });

  afterAll(async () => {
    // Fecha a conexão e para o MongoDB em memória
    if (Mongo.client) {
      await Mongo.client.close();
    }
    await mongod.stop();
  });

  describe("GET /plates", () => {
    test("should return empty array initially", async () => {
      const res = await request(app).get("/plates");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.body)).toBe(true);
      expect(res.body.body).toHaveLength(0);
    });
  });

  describe("POST /plates", () => {
    test("should create a new plate", async () => {
      const newPlate = {
        name: "Pasta Carbonara",
        description: "Italian classic",
        price: 25.5,
        available: true,
      };

      const res = await request(app).post("/plates").send(newPlate);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body).toHaveProperty("insertedId");
    });

    test("should list plates after creating one", async () => {
      const newPlate = {
        name: "Pizza Margherita",
        description: "Classic pizza",
        price: 20.0,
        available: true,
      };

      await request(app).post("/plates").send(newPlate);

      const listRes = await request(app).get("/plates");

      expect(listRes.status).toBe(200);
      expect(listRes.body.body.length).toBeGreaterThan(0);
      expect(listRes.body.body.some((plate) => plate.name === "Pizza Margherita")).toBe(true);
    });
  });

  describe("GET /plates/availables/", () => {
    test("should return only available plates", async () => {
      const availablePlate = {
        name: "Sushi",
        description: "Fresh sushi",
        price: 30.0,
        available: true,
      };

      const unavailablePlate = {
        name: "Closed Plate",
        description: "Not available",
        price: 15.0,
        available: false,
      };

      await request(app).post("/plates").send(availablePlate);
      await request(app).post("/plates").send(unavailablePlate);

      const res = await request(app).get("/plates/availables/");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body.every((plate) => plate.available === true)).toBe(true);
    });
  });
});
