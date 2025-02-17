import request from "supertest";
import { app } from "../server";
import { Resource } from "../model/Resource";
import mongoose from "mongoose";

describe("Resource Controller", () => {
  describe("POST /api/resource/create-resource", () => {
    it("should create a new resource", async () => {
      const resourceData = {
        name: "Test Resource",
        description: "Test Description",
        s3id: "test-s3-id",
        workshopIDs: [new mongoose.Types.ObjectId()],
      };

      const response = await request(app)
        .post("/api/resource/create-resource")
        .send(resourceData);

      expect(response.status).toBe(201);
      expect(response.body.resource.name).toBe(resourceData.name);
    });
  });

  describe("GET /api/resource/workshop/:workshopId/resources", () => {
    it("should get resources for a workshop", async () => {
      const workshopId = new mongoose.Types.ObjectId();
      const resource = new Resource({
        name: "Test Resource",
        description: "Test Description",
        s3id: "test-s3-id",
        workshopIDs: [workshopId],
      });
      await resource.save();

      const response = await request(app).get(
        `/api/resource/workshop/${workshopId}/resources`,
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe(resource.name);
    });
  });
});
