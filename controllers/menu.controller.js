import Menu from "../models/menu.model.js";
import { errorHandler } from "../utils/error.js";

//Tüm menüleri getir
export const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir menüyü id'ye göre getir
export const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Popüler menüler
 export const getPopularMenus = async (req, res) => {
  try {
    // `popular` alanı `true` olan menüleri sorgula
    const popularMenus = await Menu.find({ popular: true });
    res.status(200).json(popularMenus);
  } catch (error) {
    errorHandler(res, error.message, 500);
  }
}; 


//Popüler menüleri getir(boolean değerine göre)
