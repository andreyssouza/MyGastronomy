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
    it("should register a new user", async () => {
      const newUser = {
        fullname: "João Silva",
        email: "joao@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const res = await request(app).post("/auth/signup").send(newUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body).toHaveProperty("token");
      expect(res.body.body.user).toHaveProperty("email", "joao@example.com");
    });

    it("should not allow duplicate email", async () => {
      const user = {
        fullname: "Maria Silva",
        email: "maria@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await request(app).post("/auth/signup").send(user);
      const res = await request(app).post("/auth/signup").send(user);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.body.text).toBe("User already exists");
    });

    it("should reject mismatched passwords", async () => {
      const user = {
        fullname: "Pedro Santos",
        email: "pedro@example.com",
        password: "password123",
        confirmPassword: "different123",
      };

      const res = await request(app).post("/auth/signup").send(user);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.body.text).toBe("Validation error");
    });

    it("should reject invalid email", async () => {
      const user = {
        fullname: "Test User",
        email: "invalid-email",
        password: "password123",
        confirmPassword: "password123",
      };

      const res = await request(app).post("/auth/signup").send(user);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    it("should reject short password", async () => {
      const user = {
        fullname: "Test User",
        email: "test@example.com",
        password: "123",
        confirmPassword: "123",
      };

      const res = await request(app).post("/auth/signup").send(user);

      expect(res.status).toBe(400);
      expect(res.body.body.text).toBe("Validation error");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/auth/signup").send({
        fullname: "Test User",
        email: "test@example.com",
        password: "testpassword123",
        confirmPassword: "testpassword123",
      });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "testpassword123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.body).toHaveProperty("token");
      expect(res.body.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should reject login with wrong password", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body.body.text).toBe("Invalid email or password");
    });

    it("should reject login with non-existent email", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "anypassword",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    it("should reject invalid email format on login", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "invalid-email",
        password: "testpassword123",
      });

      expect(res.status).toBe(400);
      expect(res.body.body.text).toBe("Validation error");
    });
  });
});
