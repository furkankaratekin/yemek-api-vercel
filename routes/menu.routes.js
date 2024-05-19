import express from "express";
import { getAllMenus, getPopularMenus } from "../controllers/menu.controller.js";
 
const router = express.Router();

 router.get("/",getAllMenus);
 router.get("/popular",getPopularMenus);


//Tüm menüleri listele
//Tüm popüler menüleri listele

export default router;
