import mongoose, { Schema, Document } from "mongoose";

interface IResource extends Document {
  name: string;
  description: string;
  s3id: string;
  boardFileID: Schema.Types.ObjectId;
  workshopIDs: Schema.Types.ObjectId[];
  tags: string[];
}

const ResourceSchema: Schema<IResource> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String, required: true }, // Placeholder for now
  boardFileID: { type: Schema.Types.ObjectId, ref: "BoardFile" },
  workshopIDs: [{ type: Schema.Types.ObjectId, ref: "Workshop" }],
  tags: [{ type: String }],
});

const Resource = mongoose.model<IResource>("Resource", ResourceSchema);
export { Resource, IResource };
