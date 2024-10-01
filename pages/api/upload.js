import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { file } = req.body; // Get file data from the request
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      res.status(500).json({ error: "Image upload failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
