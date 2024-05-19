import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    recipe_id: {
      type: String, // Tarif ID'si, doğru bir ObjectId olmalı
      ref: "Recipe",
    },
    user_username: {
      type: String, // Kullanıcı adı artık bir string
    },
    user_profile_picture: {
      type: String, // Kullanıcı profil resmi URL'si de bir string
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
