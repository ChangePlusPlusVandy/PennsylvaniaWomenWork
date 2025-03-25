import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  users: Schema.Types.ObjectId[];
  calendarLink: string;
}

const EventSchema: Schema<IEvent> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  calendarLink: { type: String, required: false },
});

const Event = mongoose.model<IEvent>("Event", EventSchema);

export { Event, IEvent };
