import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [50, "Title must not exceed 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    minlength: [5, "Description must be at least 5 characters"],
    maxlength: [150, "Description must not exceed 150 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be a positive number"],
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
    trim: true,
    minlength: [2, "Brand must be at least 2 characters"],
    maxlength: [30, "Brand must not exceed 30 characters"],
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
  },
  images: {
    type: [String],
    validate: {
      validator: (val) => val.length > 0,
      message: "At least one image is required",
    },
    required: true,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, "Rating average can't be negative"],
      max: [5, "Rating average can't exceed 5"],
    },
    count: {
      type: Number,
      default: 0,
      min: [0, "Rating count can't be negative"],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
productSchema.index({ title: 1, brand: 1 }, { unique: true });
export default mongoose.model("Product", productSchema);
