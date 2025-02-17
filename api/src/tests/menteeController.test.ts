import request from "supertest";
import { app } from "../server";
import { Workshop } from "../model/Workshop";
import User from "../model/User";
import mongoose, { Types } from "mongoose";

describe("Mentee Controller", () => {
  describe("GET /api/mentee/:menteeId/workshops", () => {
    it("should get all workshops for a mentee", async () => {
      // Create a mentee
      const mentee = await User.create({
        firstName: "Test",
        lastName: "Mentee",
        username: "testmentee",
        email: "mentee@test.com",
        role: "mentee",
        workshopIDs: [],
      });

      // Create a workshop and explicitly set the mentee
      const workshop = (await Workshop.create({
        name: "Test Workshop",
        description: "Test Description",
        s3id: "test-s3-id",
        mentee: mentee._id,
      })) as any;

      // Add workshop to mentee's workshopIDs
      await User.findByIdAndUpdate(
        mentee._id,
        { $push: { workshopIDs: workshop._id } },
        { new: true },
      );

      // Wait a moment for the database to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await request(app).get(
        `/api/mentee/${mentee._id}/workshops`,
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].name).toBe(workshop.name);
    });

    it("should return 404 if no workshops found for mentee", async () => {
      const menteeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/mentee/${menteeId}/workshops`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "No workshops found for this user",
      });
    });
  });

  describe("PATCH /api/mentee/:menteeId/add-workshop", () => {
    it("should add a workshop to a mentee", async () => {
      // Create a mentee
      const mentee = await User.create({
        firstName: "Test",
        lastName: "Mentee",
        username: "testmentee",
        email: "mentee@test.com",
        role: "mentee",
        workshopIDs: [],
      });

      // Create a workshop
      const workshop = (await Workshop.create({
        name: "Test Workshop",
        description: "Test Description",
        s3id: "test-s3-id",
      })) as any; // Type assertion to fix _id access

      const response = await request(app)
        .patch(`/api/mentee/${mentee._id}/add-workshop`)
        .send({ workshopId: workshop._id });

      expect(response.status).toBe(200);

      // Verify the workshop was added to the mentee
      const updatedMentee = await User.findById(mentee._id);
      expect(updatedMentee?.workshopIDs.map((id) => id.toString())).toContain(
        workshop._id.toString(),
      );
    });

    it("should return 400 if workshopId is missing", async () => {
      const menteeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .patch(`/api/mentee/${menteeId}/add-workshop`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Missing required fields" });
    });

    it("should return 404 if mentee not found", async () => {
      const menteeId = new mongoose.Types.ObjectId();
      const workshopId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/mentee/${menteeId}/add-workshop`)
        .send({ workshopId });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Mentee not found" });
    });
  });
});
