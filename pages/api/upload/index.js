import Foto from "@/db/models/Foto";
import dbConnect from "@/db/connect";

export default async function handler(req, res) {
  try {
    await dbConnect();
    if (req.method === "POST") {
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }
      const newFoto = new Foto({ imageUrl });
      await newFoto.save();
      return res
        .status(201)
        .json({ message: "Image saved successfully", foto: newFoto });
    }
  } catch (e) {
    console.log(e);
  }
}
