import UserFavorites from "@/db/models/UserFavorites";
import dbConnect from "@/db/connect";
import { ObjectId } from "mongodb";

export default async function handler(request, response) {
  try {
    await dbConnect();
    try {
      if (request.method === "GET") {
        const { userId } = request.query; // taking the user id from the request url

        if (!userId) {
          return response
            .status(400)
            .json({ message: "No user ID was provided." });
        }

        const userFavorites = await UserFavorites.findOne({ userId })
          .populate("imageIds")
          .exec();

        if (!userFavorites) {
          //if a new user logs in a new favorites collection is created in the db for that user
          const userFavorites = await UserFavorites.create({
            userId,
            imageIds: [],
          });

          return response.status(200).json(userFavorites);
        }

        // return an array of all images that where liked
        return response.status(200).json(userFavorites);
      }
      if (request.method === "POST") {
        try {
          const { userId, fotoId, isLiked } = request.body;

          const updateOperation = isLiked
            ? { $pull: { imageIds: new ObjectId(fotoId) } } // remove fotoId from userFavorites imageIds
            : { $push: { imageIds: new ObjectId(fotoId) } }; // add fotoId to userFavorites imageIds

          // Update in MongoDB
          await UserFavorites.updateOne(
            { userId: String(userId) },
            updateOperation
          );

          response.status(200).json({ message: "Request received" });
        } catch (e) {
          console.log(e);
          return response.status(405).json({
            message: "Something went wrong during Like Post request.",
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
