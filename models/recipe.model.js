import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true, // Ekleme: name alanı zorunlu olmalıdır
    },
    picture: {
      type: String,
    },
    category: {
      type: String,
    },
    youtube_link: {
      type: String,
    },
    ingredients: [
      {
        type: String, // Düzelme: ingredients bir dizi string olmalıdır, Array değil
      },
    ],
    recipe: {
      type: String,
    },
    calorie: {
      type: String,
    },
    content_photos: [
      {
        type: String, // Düzelme: content_photos bir dizi string olmalıdır, Array değil
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
