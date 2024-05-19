import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    recipe_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipes",
      },
    ],
    content: {
      type: String,
      required: true,
    },
    popular:{
      type: Boolean
    },

    //Menülerde kimin oluşturduğunun bir önemi yok. Bu bilgi sadece gösterim
/*     createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, */  
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
