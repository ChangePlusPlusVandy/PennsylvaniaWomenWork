import mongoose, { Schema, Document } from "mongoose";
// interface
interface IWorkshop extends Document {
  name: string;
  description: string;
  s3id?: string; // Optional for now TODO: connect with S3 bucket
  coverImageS3id?: string;
  createdAt: Date;

  // updateContent(newContent: string): Promise<void>;
}

// workshop schema
const WorkshopSchema: Schema<IWorkshop> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  s3id: { type: String }, // S3 ID for associated files
  coverImageS3id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// update text content of the workshop
// TODO: is this needed ???
WorkshopSchema.methods.updateContent = async function (
  newContent: string,
): Promise<void> {
  this.textContent = newContent;
  await this.save();
};
// mongoose model
const Workshop = mongoose.model<IWorkshop>("Workshop", WorkshopSchema);
export { Workshop, IWorkshop };
