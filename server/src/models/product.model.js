import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    image: {
        type: String,
        required: [true, "product image is required"],  // cloudinary url
    },
    price: {
        type: Number,
        required: true,
        min:0
    },
    category:{
        type:String,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });


const Product = mongoose.model("Product", ProductSchema);

export default Product;