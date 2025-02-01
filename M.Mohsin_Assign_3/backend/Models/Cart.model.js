import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name : {
          type: String,
          required: true,
        },
        price : {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],    
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
