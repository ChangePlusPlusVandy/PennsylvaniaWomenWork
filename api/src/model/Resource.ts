import mongoose, { Schema, Document } from "mongoose";

interface IResource extends Document {
  name: string;
  description: string;
  s3id: string;
  workshopIDs: Schema.Types.ObjectId[];
}

const ResourceSchema: Schema<IResource> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String, required: true }, // Placeholder for now
  workshopIDs: [{ type: Schema.Types.ObjectId, ref: "Workshop" }],
});

const Resource = mongoose.model<IResource>("Resource", ResourceSchema);
export { Resource, IResource };
