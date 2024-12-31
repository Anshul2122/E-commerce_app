import ErrorHandler from "./../utils/errorHandler.js";
import asyncHandler from "./../middleware/catchAsyncErrors.js";
import User from "./../models/user.model.js";
import Order from "../models/order.model.js";
import { reduceStock } from "../utils/feature.js";
import Product from "../models/product.model.js";


const newOrder = asyncHandler(async (req, res, next) => {
    const {
      shippingInfo,
      OrderItems,
    } = req.body;

    const userId = req.user._id;
    const userOrdering = await User.findById(userId);
    if (!userOrdering) {
      return next(new ErrorHandler("User not found", 404));
    }
    const username = userOrdering.name;
    const email = userOrdering.email;

    if (!shippingInfo || !OrderItems ) {
      return next(new ErrorHandler("All fields are required ", 400));
    }
    await Order.create({
        shippingInfo,
        OrderItems,
        userId: userId,
        username,
        email,
        total:total
    });
    await reduceStock(OrderItems);

    return res.status(201).json({ success: true, message: "Order placed successfully" });
});

const myOrders = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    const userId = req.user._id;
    const myOrder = await Order.find({ userId });
    if (!myOrder) {
        return next(new ErrorHandler("No orders found for this user", 404));
    }
    
    res.status(200).json({ success: true, message: "orders found", myOrder });
    
});

const getAllOrders = asyncHandler(async (req, res, next) => {
    const adminId = req.user._id;
    const products = await Product.find({ productBy: adminId });
    if (!products || products.length===0) return next(new ErrorHandler("No product added by you yet", 404));
    const productIds = products.map(product => product._id);
    const allOrders = await Order.find({"OrderItems.productId":{$in: productIds}})

    if (allOrders.length === 0) {
        return next(new ErrorHandler("No orders found for these products", 404));
    }

    if (res.statusCode === 200) { 
        console.log("orders founded");
    }

    return res.status(200).json({
        success: true,
        message: "Orders found",
        allOrders, 
    });
    
});

const getSingleOrder = asyncHandler(async (req, res, next) => {
    const orderId  = req.params.id;
    const order = await Order.findById(orderId)
    if (!order) return next(new ErrorHandler(`${order.username}'s order not found`, 404));
    if (res.statusCode === 200) {
      console.log("orders founded");
    }
    res
      .status(200)
      .json({ success: true, messag: `${order.username}'s order found`, order });
});

const processOrder = asyncHandler(async (req, res, next) => {

    const id  = req.params.id;
    const order = await Order.findByIdAndUpdate(id);
    if(!order) return next(new ErrorHandler("order not found", 404));

    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Out for Delivery";
        break;
      case "Out for Delivery":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }

    await order.save();
    
    if(res.statusCode === 200) console.log("order status changed");
    
    return res.status(200).json({
        success: true,
        message: `your order status is updated to ${order.status} and is in process`,
      });
});

const deleteOrder = asyncHandler(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    
    if (!order) return next(new ErrorHandler(` order not found`, 404));
    if (res.statusCode === 200) {
      console.log("orders deleted");
    }
    res
      .status(200)
      .json({ success: true, message: `order deleted` });
});


export { newOrder, myOrders, getAllOrders, getSingleOrder, processOrder, deleteOrder };
