import Comment from "../models/comment.model.js ";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// Yeni yorum ekleme fonksiyonu
export const addComment = async (req, res) => {
  const { recipe_id, comment } = req.body;

  // `verifyToken` middleware'inden gelen kullanıcı ID'si kullanılarak kullanıcıyı bul
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      recipe_id,
      user_username: user.username, // Kullanıcı modelinden username
      user_profile_picture: user.profilePicture, // Kullanıcı modelinden profil resmi
      comment,
    });

    const savedComment = await newComment.save();

    // Kaydedilen yorumu, kullanıcının kullanıcı adı ve profil resmiyle birlikte döndür
    res.status(201).json({
      id: savedComment.id,
      recipe_id: savedComment.recipe_id,
      user_username: user.username,
      user_profile_picture: user.profilePicture,
      comment: savedComment.comment,
      createdAt: savedComment.createdAt,
      updatedAt: savedComment.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yorum güncelleme fonksiyonu
export const updateComment = async (req, res) => {
  const { commentId, newComment } = req.body;

  try {
    // Güncellenmek istenen yorumu bul
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Token ile gelen kullanıcı bilgilerini kullanarak kullanıcıyı bul
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Yorumun sahibi ile isteği yapan kullanıcı aynı mı kontrol et
    if (comment.user_username !== user.username) {
      // Kullanıcılar eşleşmiyorsa yetki hatası ver
      return res
        .status(403)
        .json({ message: "You can only update your own comments" });
    }

    // Yorumu güncelle
    comment.comment = newComment; // Yorum metnini güncelle
    comment.updatedAt = new Date(); // Güncelleme tarihini şu anki zaman olarak ayarla
    await comment.save(); // Değişiklikleri kaydet

    // Güncellenen yorumu dön
    res.status(200).json({
      id: comment.id,
      recipe_id: comment.recipe_id,
      user_username: user.username,
      user_profile_picture: user.profilePicture,
      comment: comment.comment, // Güncellenen yorum metni
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Yorumu sil
export const deleteComment = async (req, res) => {
  const { commentId } = req.params; // Yorumun ID'sini URL parametresinden al

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Token ile gelen kullanıcı bilgilerini kullanarak kullanıcıyı bul
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Yorumun sahibi ile isteği yapan kullanıcı aynı mı kontrol et
    if (comment.user_username !== user.username) {
      // Kullanıcılar eşleşmiyorsa yetki hatası ver
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    // Yorumu sil
    await Comment.findByIdAndDelete(commentId);

    // Başarı yanıtı dön
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//yorumları göster
export const getComments = async (req, res, next) => {
  const { recipe_id } = req.params; // Tarifin ID'sini URL parametresinden al
  try {
    // Belirtilen tarif ID'sine sahip tüm yorumları bul
    const comments = await Comment.find({ recipe_id })
      .select("user_username user_profile_picture comment createdAt updatedAt")
      .sort({ createdAt: -1 });

    // Yorum listesini JSON formatında döndür
    res.json(comments);
  } catch (error) {
    // Hata olması durumunda bir sonraki middleware'e hatayı ilet
    next(error);
  }
};







