import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  getComments
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Mevcut yorum ekleme route'u
router.post("/add-comment", verifyToken,addComment); //verifyToken'ı daha sonra ekleyeceğiz.

// Yorum güncelleme route'unu ekleyin
router.put("/update-comment", verifyToken, updateComment);

//Yorumu sil
router.delete("/delete-comment/:commentId", verifyToken, deleteComment);

//Yorumları göster
router.get("/list-comment/:recipe_id" ,getComments )

export default router;
//http://localhost:5000/api/comment
