import ErrorHandler from './../utils/errorHandler.js';
import asyncHandler from './../middleware/catchAsyncErrors.js';
import User from './../models/user.model.js';
import {uploadOnCloudinary, deleteFromCloudinary } from "../config/cloudinary.js"
import Product from '../models/product.model.js';


const newProduct = asyncHandler(async(req,res,next) => {
    const {name, description, price, category, stock} = req.body;
    
    if(!req.files || req.files.length === 0) return next(new ErrorHandler("Please add product images", 400));
    if(req.files.length<1 || req.files.length>5)  return next(new ErrorHandler("please add atleast 1 and atmost 5 product image", 400));
    if(!name || !price || !stock || !description || !category) return next(new ErrorHandler("please provide all details", 400));
    const photosLocalPaths = req.files.map(file => file.path);
    const results = await Promise.all(
        photosLocalPaths.map(path=> uploadOnCloudinary(path))
    );
    if(!results || results.length === 0) return next(new ErrorHandler( "error in upload on cloudinary", 500));
    const photos = results.map(result=>result.url);
    
    const product = await Product.create({
        name,
        price, 
        description, 
        photos,
        category,
        stock,
        productBy:req.user._id,
    });

    return res.status(201).json({
        success: true,
        message:"product added",
        product
    })
})

const getAllProducts = asyncHandler(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search,
            $options:i,
        }
    }
    if (price) {
        baseQuery.price = {
          price: { $lte: Number(price) },
        };
    }
    if (category) { 
        baseQuery.category = category;
    }

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [product, filteredProduct] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

   
    const totalPage = Math.ceil(filteredProduct.length / limit);
    return res.status(200).json({
        success: true,
        product, totalPage
    })
})

const getlatestProducts = asyncHandler(async(req,res,next)=>{
    const products = await Product.find({}).sort({createdAt:-1}).limit(5)
    if(!products){
        return next(new ErrorHandler("No products found", 404))
    }
    return res.status(200).json({success:true, message:"latest products fetched", products})
})

const getAllCategoryProducts = asyncHandler(async(req,res,next)=>{
    const categories = await Product.distinct("category");
    
    return res.status(200).json({success:true, message:"latest products fetched", categories})
});

const getCategoryProduct = asyncHandler(async(req,res,next)=>{
    const {category} = req.query;
    if(!category) return next(new ErrorHandler("Please provide category", 400));
    const products = await Product.find({category});

    if(products.length===0){
        return res.status(404).json({
            success: false,
            message: "No products found in this category"
        });
    }
    return res.status(200).json({success:true, message:`${category} founded`, products})
});

const getAdminProducts = asyncHandler(async(req,res,next)=>{
    const admin = await User.findById(req.user._id);
    if(!admin || admin.role!== 'admin'){
        return next(new ErrorHandler("You are not allowed to access this info", 401))
    }
    const adminId = admin._id;
    
    const products = await Product.find({productBy:adminId});
    console.log("products: ",products);
    
    if(!products){
        return next(new ErrorHandler("No products found", 404));
    }
    return res.status(200).json({success:true, message:"admin products fetched", products})
});

const getSingleProduct = asyncHandler(async(req,res,next)=>{
    const id = req.params.id;
    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHandler(`product with ${id} id not found not found`, 404));
    }

    return res.status(200).json({
        success: true,
        product
    })
});

const updateProduct = asyncHandler(async(req, res, next)=>{
    const id = req.params.id;
    let product = await Product.findById(id);
    if(req.files || req.files?.length>0){
        product.photos.map(photo=>{deleteFromCloudinary(photo)})
        product.photos = [];
        if(req.files.length>5){
            return next(new ErrorHandler(`Please add product images or keep the count to 5 or less, there are already ${product.photos.length+req.files.length}`, 400));
        }
        const photosLocalPaths = req.files.map(file => file.path);
        photosLocalPaths.map(path=>console.log(path))
        
        const results = await Promise.all(
            photosLocalPaths.map(path=> uploadOnCloudinary(path))
        );
        if(!results || results.length === 0) return next(new ErrorHandler( "error in upload on cloudinary", 500));
        product.photos = results.map(result=>result.url);

    }
    let {name, price, stock, category, description} = req.body;
    
    if(!product) return next(new ErrorHandler(`product with ${id} id not found`, 404));
    
    if(name){
        product.name=name;
    }
    if(price && price>0){
        product.price=price;
    }
    if(stock && stock>=0){
        product.stock=stock;
    }
    if(category){
        product.category=category;
    }
    if(description){
        product.description=description;
    }
    await product.save();

    product = await Product.findById(id);

    return res.status(200).json({
        success: true,
        message:"product updated",
        product,
        
    })
});

const deleteProduct = asyncHandler(async(req, res, next)=>{
    const id = req.params.id;
    const product = await User.findById(id);

    if(!product){
        return next(new ErrorHandler(`product with ${id} id not found`, 404));
    }
    await product.deleteOne();

    return res.status(200).json({
        message:`User account deleted`,
        success: true
    });
})

export {newProduct, getAllProducts, getlatestProducts, getAllCategoryProducts, getCategoryProduct, getAdminProducts, getSingleProduct, updateProduct, deleteProduct}
