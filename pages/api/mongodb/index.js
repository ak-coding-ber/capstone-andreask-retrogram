import Foto from "@/db/models/Foto";
import dbConnect from "@/db/connect";

export default async function handler(req, res) {
  try {
    await dbConnect();
    if (req.method === "POST") {
      const { imageUrl, retroImageUrl } = req.body;
      if (!imageUrl || !retroImageUrl) {
        return res
          .status(400)
          .json({ message: "Not all Image Urls were provided" });
      }
      const newFoto = await Foto.create({ imageUrl, retroImageUrl });
      return res
        .status(201)
        .json({ message: "Images saved successfully", foto: newFoto });
    }
  } catch (e) {
    console.log(e);
  }
}
