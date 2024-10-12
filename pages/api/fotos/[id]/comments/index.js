import Comment from "@/db/models/Comment";
import dbConnect from "@/db/connect";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  const { id } = request.query;

  if (!id) {
    return;
  }

  try {
    await dbConnect();
    try {
      if (request.method === "GET") {
        const objectId = new ObjectId(id);
        // finds all comments for a specific foto id
        const comments = await Comment.find({ fotoId: objectId });

        return response.status(200).json(comments);
      } else if (request.method === "POST") {
        try {
          const newComment = await Comment.create(request.body);
          response
            .status(201)
            .json({ message: "Comment added successfully", newComment });
        } catch (error) {
          console.error("Comment could not be created in Backend.", error);
          response.status(500).json({ error: "Failed to add comment" });
        }
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
