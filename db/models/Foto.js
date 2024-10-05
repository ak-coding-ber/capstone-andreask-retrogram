import mongoose from "mongoose";

const { Schema } = mongoose;
const fotoSchema = new Schema({
  imageUrl: { type: String, required: true },
  retroImageUrl: { type: String, required: true },
});

const Foto = mongoose.models.Foto || mongoose.model("Foto", fotoSchema);
export default Foto;
