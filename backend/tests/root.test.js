import request from "supertest";
import { createApp } from "../src/app.js";

describe("GET / - Root endpoint", () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test("should return 200 and welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("sucess", true);
    expect(res.body.body).toBe("Welcome to MyGastronomy!");
  });
});
