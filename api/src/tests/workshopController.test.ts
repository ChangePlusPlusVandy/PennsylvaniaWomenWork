import request from "supertest";
import { Workshop } from "../model/Workshop";
import { app } from "../server";
import mongoose from "mongoose";

describe("Workshop Controller", () => {
  describe("POST /api/workshop/create-workshop", () => {
    it("should create a new workshop", async () => {
      const workshopData = {
        name: "Test Workshop",
        description: "Test Description",
        s3id: "test-s3-id",
      };

      const response = await request(app)
        .post("/api/workshop/create-workshop")
        .send(workshopData);

      expect(response.status).toBe(201);
      expect(response.body.workshop.name).toBe(workshopData.name);
      expect(response.body.workshop.description).toBe(workshopData.description);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/api/workshop/create-workshop")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing required fields");
    });
  });

  describe("GET /api/workshop/:id", () => {
    it("should get a workshop by id", async () => {
      const workshop = new Workshop({
        name: "Test Workshop",
        description: "Test Description",
        s3id: "test-s3-id",
      });
      await workshop.save();

      const response = await request(app).get(`/api/workshop/${workshop._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(workshop.name);
    });

    it("should return 404 if workshop not found", async () => {
      // Create a new valid but non-existent ObjectId
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/workshop/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });
});
