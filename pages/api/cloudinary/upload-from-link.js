const cloudinary = require("cloudinary").v2;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { retroUrl } = req.body;

  try {
    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(retroUrl, {
      folder: "retrogram/generated-pixelart",
      resource_type: "image",
    });

    // Return Cloudinary URL
    res.status(200).json({ cloudinaryRetroUrl: cloudinaryResponse.secure_url });
  } catch (error) {
    console.error("Error during Cloudinary API call:", error);
    res.status(500).json({ message: "Failed to upload generated image." });
  }
}
