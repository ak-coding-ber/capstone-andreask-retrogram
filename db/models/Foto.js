import mongoose from "mongoose";

const { Schema } = mongoose;
const fotoSchema = new Schema({
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Foto = mongoose.models.Foto || mongoose.model("Foto", fotoSchema);
export default Foto;
