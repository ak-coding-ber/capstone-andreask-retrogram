import UserFavorites from "@/db/models/UserFavorites";
import dbConnect from "@/db/connect";

export default async function handler(request, response) {
  try {
    await dbConnect();
    try {
      if (request.method === "GET") {
        const { userId } = request.query; // taking the user id from the request url

        console.log("Received userId:", userId);

        if (!userId) {
          return response
            .status(400)
            .json({ message: "No user ID was provided." });
        }

        const userFavorites = await UserFavorites.find({ userId })
          .populate("imageIds")
          .exec();

        console.log("userFavorites:", userFavorites);

        if (!userFavorites) {
          return response
            .status(404)
            .json({ message: "No favorites found for this user" });
        }

        // return an array of all images that where liked
        return response.status(200).json(userFavorites);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}
