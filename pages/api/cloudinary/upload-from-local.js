const cloudinary = require("cloudinary").v2;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { imageSrc } = req.body;

  try {
    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(imageSrc, {
      folder: "retrogram/fotos",
      resource_type: "image",
    });

    // Return Cloudinary URL
    res.status(200).json({ cloudinaryFotoUrl: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error("Error during Cloudinary API call:", error);
    res.status(500).json({ message: "Failed to upload local image." });
  }
}
