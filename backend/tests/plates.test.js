import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongo } from "../src/database/mongo.js";
import { createApp } from "../src/app.js";

let mongod;
let app;

describe("Plates routes - with MongoDB in memory", () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await Mongo.connect({
      mongoConnectionString: uri,
      mongoDbName: "testdb",
    });

    app = createApp();
  });

  afterAll(async () => {
    if (Mongo.client) {
      await Mongo.client.close();
    }
    await mongod.stop();
  });

  describe("GET /plates", () => {
    it("should return empty array initially", async () => {
      const res = await request(app).get("/plates");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.body)).toBe(true);
      expect(res.body.body).toHaveLength(0);
    });
  });

  describe("POST /plates", () => {
    it("should create a new plate", async () => {
      const newPlate = {
        name: "Pasta Carbonara",
        description: "Italian classic",
        price: 25.5,
        available: true,
      };

      const res = await request(app).post("/plates").send(newPlate);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body).toHaveProperty("insertedId");
    });

    it("should list plates after creating one", async () => {
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

    it("should reject invalid plate data", async () => {
      const invalidPlate = {
        name: "P",
        price: -10,
      };

      const res = await request(app).post("/plates").send(invalidPlate);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.body.text).toBe("Validation error");
    });
  });

  describe("GET /plates/availables/", () => {
    it("should return only available plates", async () => {
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
