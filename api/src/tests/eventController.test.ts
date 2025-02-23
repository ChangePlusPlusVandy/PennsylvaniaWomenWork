import request from "supertest";
import { app } from "../server";
import { Event } from "../model/Event";
import mongoose from "mongoose";

describe("Event Controller", () => {
  describe("POST /api/event", () => {
    it("should create a new event", async () => {
      const eventData = {
        name: "Test Event",
        description: "Test Description",
        date: new Date(),
        userIds: [new mongoose.Types.ObjectId()],
        calendarLink: "https://calendar.com/event",
      };

      const response = await request(app).post("/api/event").send(eventData);

      expect(response.status).toBe(201);
      expect(response.body.event.name).toBe(eventData.name);
      expect(response.body.event.description).toBe(eventData.description);
    });
  });

  describe("GET /api/event/:userId", () => {
    it("should get events for a user", async () => {
      const userId = new mongoose.Types.ObjectId();
      const event = await Event.create({
        name: "Test Event",
        description: "Test Description",
        date: new Date(),
        users: [userId],
        calendarLink: "https://calendar.com/event",
      });

      const response = await request(app).get(`/api/event/${userId}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].name).toBe(event.name);
      }
    });
  });
});
