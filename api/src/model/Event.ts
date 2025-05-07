import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  expirationDate?: Date;
  users: Schema.Types.ObjectId[];
  calendarLink?: string;
}

const EventSchema: Schema<IEvent> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  expirationDate: { type: Date, required: false },
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  calendarLink: { type: String, required: false },
});

EventSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

const Event = mongoose.model<IEvent>("Event", EventSchema);

export { Event, IEvent };
