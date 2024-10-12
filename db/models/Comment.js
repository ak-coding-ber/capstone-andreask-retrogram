import mongoose from "mongoose";

const { Schema } = mongoose;
const commentSchema = new Schema({
  fotoId: { type: Schema.Types.ObjectId, ref: "Foto", required: true }, // Reference to the photo
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;
