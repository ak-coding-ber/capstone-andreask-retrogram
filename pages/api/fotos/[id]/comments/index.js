import Comment from "@/db/models/Comment";
import dbConnect from "@/db/connect";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }
  //   console.log("id", id);

  try {
    await dbConnect();
    try {
      if (request.method === "GET") {
        const objectId = new ObjectId(id);
        // finds all comments for a specific foto id
        const comments = await Comment.find({ fotoId: objectId });

        console.log(comments);
        return response.status(200).json(comments);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
