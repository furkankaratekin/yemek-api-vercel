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
    // URL'den id parametresini alın
    const { id } = req.params;

    // Doğrudan id değerini kullanarak menüyü bulun
    const menu = await Menu.findOne({ _id: id });

    // Menü bulunamazsa, 404 hatası döndür
    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Menü bulunursa, menüyü JSON formatında döndür
    res.json(menu);
  } catch (error) {
    // Hata oluşursa, 500 hatası ile hata mesajını döndür
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
