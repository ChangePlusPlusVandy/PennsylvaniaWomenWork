import request from "supertest";
import User from "../model/User";
import { app } from "../server";

describe("User Controller", () => {
  describe("POST /api/user/create-user", () => {
    it("should create a new user", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
        role: "mentee",
      };

      const response = await request(app)
        .post("/api/user/create-user")
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user.firstName).toBe(userData.firstName);
      expect(response.body.user.email).toBe(userData.email);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/api/user/create-user")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing required fields");
    });
  });

  describe("GET /api/user/current-user", () => {
    it("should get current user by username", async () => {
      const user = new User({
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        email: "test@example.com",
        role: "mentee",
      });
      await user.save();

      const response = await request(app)
        .get("/api/user/current-user")
        .query({ username: "testuser" });

      expect(response.status).toBe(200);
      expect(response.body.username).toBe(user.username);
      expect(response.body.role).toBe(user.role);
    });

    it("should return 404 if user not found", async () => {
      const response = await request(app)
        .get("/api/user/current-user")
        .query({ username: "nonexistent" });

      expect(response.status).toBe(404);
    });
  });
});
