import express from "express";
import { getAllMenus, getPopularMenus,getMenuById } from "../controllers/menu.controller.js";
 
const router = express.Router();

 router.get("/",getAllMenus);
 router.get("/popular",getPopularMenus);
router.get("/:id", getMenuById); // Belirli bir menüyü id'ye göre getir


//Tüm menüleri listele
//Tüm popüler menüleri listele

export default router;
