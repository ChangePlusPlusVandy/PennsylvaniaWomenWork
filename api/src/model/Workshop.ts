import mongoose, { Schema, Document } from "mongoose";
// interface
// interface IWorkshop extends Document {
//   name: string;
//   description: string;
//   s3id?: string; // Optional for now TODO: connect with S3 bucket
//   createdAt: Date;
//
//   // updateContent(newContent: string): Promise<void>;
// }
interface IWorkshop extends Document {
  name: string;
  description: string;
  s3id?: string;
  createdAt: Date;
  mentor?: Schema.Types.ObjectId;
  mentee?: Schema.Types.ObjectId;
}

// workshop schema
const WorkshopSchema: Schema<IWorkshop> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String }, // ✅ optional
  createdAt: { type: Date, default: Date.now },
  mentor: { type: Schema.Types.ObjectId, ref: "User" },
  mentee: { type: Schema.Types.ObjectId, ref: "User" },
});
const Workshop = mongoose.model<IWorkshop>("Workshop", WorkshopSchema);
export { Workshop, IWorkshop };
