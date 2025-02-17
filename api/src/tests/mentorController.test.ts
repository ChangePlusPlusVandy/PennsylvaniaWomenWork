import request from "supertest";
import { app } from "../server";
import User from "../model/User";
import mongoose from "mongoose";

describe("Mentor Controller", () => {
  describe("GET /api/mentor/:mentorId/mentees", () => {
    it("should get all mentees for a mentor", async () => {
      // Create a mentor
      const mentor = new User({
        firstName: "Mentor",
        lastName: "Test",
        username: "mentortest",
        email: "mentor@test.com",
        role: "mentor",
        menteeInfo: [new mongoose.Types.ObjectId()],
      });
      await mentor.save();

      const response = await request(app).get(
        `/api/mentor/${mentor._id}/mentees`,
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 404 if mentor not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/mentor/${fakeId}/mentees`);

      expect(response.status).toBe(404);
    });
  });
});
