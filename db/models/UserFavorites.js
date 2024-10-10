import mongoose from "mongoose";

const { Schema } = mongoose;
const userFavoritesSchema = new Schema(
  {
    userId: { type: String, required: true },
    imageIds: { type: [Schema.Types.ObjectId], ref: "Foto", required: true },
  },
  { collection: "favorites" }
);

const UserFavorites =
  mongoose.models.UserFavorites ||
  mongoose.model("UserFavorites", userFavoritesSchema);

export default UserFavorites;
