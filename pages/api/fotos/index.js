import Foto from "@/db/models/Foto";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  try {
    await dbConnect();
    try {
      if (request.method === "GET") {
        const fotos = await Foto.find();
        return response.status(200).json(fotos);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
