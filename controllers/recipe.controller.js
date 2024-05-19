import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

// Tüm tarifleri getiren fonksiyon
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ID'ye göre Recipe arama fonksiyonu
const getRecipeById = async (req, res) => {
  try {
    // URL'den _id parametresini alın
    const { id } = req.params; // _id yerine id kullanıldığına dikkat edin, eğer route '/recipes/:id' şeklinde tanımlanmışsa

    // Doğrudan _id değerini kullanarak tarifi bul
    const recipe = await Recipe.findOne({ _id: id });
    //console.log(id); // id değerini konsola yazdır

    // Tarif bulunamazsa, 404 hatası döndür
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Tarif bulunursa, tarifi JSON formatında döndür
    res.json(recipe);
  } catch (error) {
    // Hata oluşursa, 500 hatası ile hata mesajını döndür
    res.status(500).json({ message: error.message });
  }
};
//yukarıdaki fonksiyonda eğer url'de id yazıysak ona göre tanımla

//kullanıcı id'ye göre tarifleri listelel
export const getRecipesByUserId = async (req, res) => {
  try {
    // Kullanıcı ID'si, req.params.id veya req.query.id üzerinden alınabilir,
    // bu yüzden gerçek uygulama senaryonuza bağlı olarak bu kısmı uygun şekilde değiştirebilirsiniz.
    const userId = req.params.id; // veya req.query.id;

    // createdBy alanına göre filtreleme yapılıyor.
    const recipes = await Recipe.find({ createdBy: userId });

    // Eğer tarifler bulunursa, bunları JSON formatında döndür.
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: "Bu kullanıcıya ait tarif bulunamadı." });
    }
  } catch (error) {
    // Hata durumunda, hatayı JSON formatında döndür.
    res.status(500).json({ message: error.message });
  }
};


//Kullanıcı ID'ye göre tarif ekleme
export const addRecipe = async (req ,res, next) =>{
  if (req.body.password) {
    return next (errorHandler(401,"You can update only your account"))
  }
  else{  try {
    // Kullanıcı giriş yapmış, tarif ekleme işlemi gerçekleştir
    const {
      name,
      picture,
      category,
      youtube_link,
      ingredients,
      recipe,
      content_photos,
      calorie,
    } = req.body;

    // Yeni tarif nesnesi oluştur
    const newRecipe = new Recipe({
      name,
      picture,
      category,
      youtube_link,
      ingredients,
      recipe,
      content_photos,
      calorie,
      createdBy: req.user.id, // Kullanıcının ID'si, tarifi kimin oluşturduğunu belirlemek için
    });
    //console.log(req.user.id)
    /* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjdlNzE4MTgwN2ExZWUyODZjMmJjNSIsImlhdCI6MTcxMDc0NTM3NywiZXhwIjoxNzEwNzQ4OTc3fQ.OnJIrUiBwx8UNkgQ2g5B0bUNyv6UVmzkJylufu4bi0U */

    // Yeni tarifi veritabanına kaydet
    const savedRecipe = await newRecipe.save();

    // Başarılı bir şekilde kaydedildiğine dair yanıt gönder
    res.status(201).json(savedRecipe);
  } catch (error) {
    next(error);
  }}

}

//Kullanıcı ID'ye göre tarif güncelle
export const updateRecipe = async (req, res, next) => {
  const { recipeId } = req.params; // URL'den tarifin ID'si alınır
  const userId = req.user.id; // Oturum açmış kullanıcının ID'si

  try {
    // İlk olarak, güncellenmek istenen tarifin mevcut kullanıcıya ait olup olmadığını kontrol et
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return next(errorHandler(404, "Recipe not found"));
    }

    // Tarifin oluşturulduğu kullanıcı ID'si ile mevcut kullanıcı ID'sini karşılaştır
    if (recipe.createdBy.toString() !== userId) {
      // Kullanıcılar uyuşmuyorsa, yetki hatası döndür
      return next(errorHandler(403, "You can only update your own recipes"));
    }

    // Kullanıcı uyuşuyorsa, güncelleme işlemine devam et
    const updatedData = {
      name: req.body.name || recipe.name,
      picture: req.body.picture || recipe.picture,
      category: req.body.category || recipe.category,
      youtube_link: req.body.youtube_link || recipe.youtube_link,
      ingredients: req.body.ingredients || recipe.ingredients,
      recipe: req.body.recipe || recipe.recipe,
      content_photos: req.body.content_photos || recipe.content_photos,
      calorie: req.body.calorie || recipe.calorie,
      // createdBy alanı güncellenemez, çünkü tarifin sahibi değiştirilemez
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updatedData,
      { new: true }
    );
    res.status(200).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};


//kullanıcı ID'ye göre tarifi sil
export const deleteRecipe = async (req, res, next) => {
  const { recipeId } = req.params; // URL'den tarifin ID'si alınır
  const userId = req.user.id; // Oturum açmış kullanıcının ID'si

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return next(errorHandler(404, "Recipe not found"));
    }

    if (recipe.createdBy.toString() !== userId) {
      return next(errorHandler(403, "You can only delete your own recipes"));
    }

    await Recipe.findByIdAndDelete(recipeId);
    res.status(200).json({ message: "Recipe successfully deleted" });
  } catch (error) {
    next(error);
  }
};

//Kullanıcı ID'ye göre tarifi favorilere(deftere) ekle
export const addFavoriteRecipe = async (req, res, next) => {
  const { userId } = req.params; // URL'den kullanıcının ID'si alınır
  const { recipeId } = req.body; // Request body'den tarifin ID'si alınır

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kullanıcının favori tarifleri arasında bu tarifin olup olmadığını kontrol et
    const isAlreadyFavorite = user.favorites_recipes.includes(recipeId);
    if (isAlreadyFavorite) {
      // Tarif zaten favorilerdeyse, hata yerine bilgilendirici bir mesaj gönder
      return res.status(200).json({ message: "Recipe is already in your favorites" });
    }

    // Tarifi kullanıcının favorilerine ekle
    user.favorites_recipes.push(recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe added to your favorites" });
  } catch (error) {
    next(error);
  }
};


//Kullanıcı ID'ye göre tarifi favorilerden(defterden) kaldır
// Kullanıcının favori tariflerinden bir tarifi kaldırmak için fonksiyon
export const removeFavoriteRecipe = async (req, res, next) => {
  const { userId } = req.params; // URL'den kullanıcının ID'si alınır
  const { recipeId } = req.body; // Request body'den kaldırılacak tarifin ID'si alınır

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kullanıcının favori tarifleri arasında bu tarifin olup olmadığını kontrol et
    const index = user.favorites_recipes.indexOf(recipeId);
    if (index === -1) {
      // Tarif zaten favorilerde değilse, bilgilendirici bir mesaj döndür
      return res.status(200).json({ message: "Recipe is not in your favorites" });
    }

    // Tarifi kullanıcının favorilerinden kaldır
    user.favorites_recipes.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Recipe removed from your favorites" });
  } catch (error) {
    next(error);
  }
};

//Favorileri listele
export const listFavorites = async (req,res,next) => {
  const {userId} = req.params;//URL'den kullanıcının ID'si alınır.
  try{
    // İlk olarak, belirtilen kullanıcının veritabanında olup olmadığını kontrol edin.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Kullanıcı bulunamadı" });
    }

    // Kullanıcının favori tariflerinin ID'lerini alın.
    const favoritesRecipesIds = user.favorites_recipes;

    // Bu ID'ler kullanılarak favori tariflerin tam listesi alınır.
    const favoritesRecipes = await Recipe.find({
      _id: { $in: favoritesRecipesIds },
    });

    // Kullanıcının favori tariflerini döndür
    return res.status(200).json(favoritesRecipes);
  }catch(error){
    next(error);
  }
}


// Fonksiyonu dışa aktarma (İsteğe bağlı)
export { getAllRecipes,getRecipeById};
