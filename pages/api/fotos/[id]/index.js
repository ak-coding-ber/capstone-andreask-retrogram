import Foto from "@/db/models/Foto";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }
  console.log("id", id);

  try {
    await dbConnect();
    try {
      if (request.method === "GET") {
        const fotos = await Foto.findById(id);
        return response.status(200).json(fotos);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
