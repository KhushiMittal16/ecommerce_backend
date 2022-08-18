const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productEgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 10,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number, 
      default:0,
    },
    photo: {
      data: Buffer, 
      contentType: String,
    },
    shipping: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductNew", productEgSchema);
