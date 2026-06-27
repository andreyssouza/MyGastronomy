import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Mongo } from "../src/database/mongo.js";
import { createApp } from "../src/app.js";

let mongod;
let app;

describe("Auth routes - with MongoDB in memory", () => {
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

  describe("POST /auth/signup", () => {
    test("should register a new user", async () => {
      const newUser = {
        fullname: "João Silva",
        email: "joao@example.com",
        password: "password123",
      };

      const res = await request(app).post("/auth/signup").send(newUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body).toHaveProperty("token");
      expect(res.body.body.user).toHaveProperty("email", "joao@example.com");
    });

    test("should not allow duplicate email", async () => {
      const user = {
        fullname: "Maria Silva",
        email: "maria@example.com",
        password: "password123",
      };

      // Primeira tentativa - sucesso
      await request(app).post("/auth/signup").send(user);

      // Segunda tentativa - deve falhar
      const res = await request(app).post("/auth/signup").send(user);

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.body.text).toBe("User already exists");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Criar um usuário para login
      await request(app).post("/auth/signup").send({
        fullname: "Test User",
        email: "test@example.com",
        password: "testpassword123",
      });
    });

    test("should login with correct credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "testpassword123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body).toHaveProperty("token");
      expect(res.body.body.user).toHaveProperty("email", "test@example.com");
    });

    test("should reject login with wrong password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.body.text).toBe("Invalid email or password");
    });

    test("should reject login with non-existent email", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "anypassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
