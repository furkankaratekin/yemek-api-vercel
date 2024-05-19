import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  listFavorites,
  getRecipesByUserId
} from "../controllers/recipe.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Mevcut tarifleri listele
router.get("/", getAllRecipes);

// Belirli bir ID'ye sahip tarifi getir
router.get("/:id", getRecipeById);

//Kullanıcı id'ye göre tarifleri listele
router.get("/user-recipes/:id",getRecipesByUserId)

// Yeni bir tarif ekle
router.post("/add", verifyToken, addRecipe);

// Mevcut bir tarifi güncelle
router.put("/update/:recipeId", verifyToken, updateRecipe);

//Mevcut bir tarifi silmek için
router.delete("/delete/:recipeId", verifyToken, deleteRecipe);

//Favorilere ekleme
router.post("/favorites/:userId/add", verifyToken, addFavoriteRecipe);

//Favorilerden Silme
router.delete("/favorites/:userId/remove", verifyToken, removeFavoriteRecipe);

//Favorileri Listeleme
router.get("/favorites/:userId",listFavorites )



export default router;
