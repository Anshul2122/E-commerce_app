import ErrorHandler from "./../utils/errorHandler.js";
import asyncHandler from "./../middleware/catchAsyncErrors.js";
import User from "./../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import { myCache, stripe } from "../app.js";


const newCoupon = asyncHandler(async(req, res, next) => {
    const { code, amount } = req.body;
    const validTill = req.body.validTill? new Date(Date.now() + req.body.validTill * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    if (!amount || !code) return next(new ErrorHandler("please provide both amount and code", 400))
    const coupon = await Coupon.create({ code, amount, validTill });
    if (res.statusCode === 200) {
        console.log('coupon created successfully');
  }
  myCache.set(`coupon-wuth-${code}`, JSON.stringify(coupon));
    return res.status(201).json({
        success: true,
        message: "Coupon created successfully",
        coupon
    })
});

const applyDiscount = asyncHandler(async (req, res, next) => {
    const { code } = req.query;
    if (!code) {
      return res.status(200).json({
        message:"no coupon code is applied by user"
      });
    }
    let discount;
    if (myCache.has(`coupon-wuth-${code}`)) {
      discount = JSON.parse(myCache.get(`coupon-wuth-${code}`));
    } else {
      discount = await Coupon.findOne({ code: code });
    }
    
    
    if (discount.status === "Expired") {
        return next(new ErrorHandler("Coupon has expired", 400));
    }
    if (!discount) return next(new ErrorHandler("Invalid coupon code", 404));
    if (discount.validTill < Date.now()) {
        discount.status = "Expired";
        await discount.save();
        return next(new ErrorHandler("Coupon has expired", 400))
    };

    return res.status(200).json({
        success: true,
        message: "Coupon applied successfully",
        discount_amount: discount.amount,
        coupon_code_status:discount.status,
    })
});

const allCoupon = asyncHandler(async (req, res, next) => {
  let coupons;
  if (myCache.has(`All-coupon`)) { 
    coupons = JSON.parse(myCache.get(`All-coupon`));
  } else {
    coupons = await Coupon.find({});
    myCache.set(`All-coupon`, JSON.stringify(coupons));
  }
  
  if (!coupons) return next(new ErrorHandler("no coupon code available", 404));
  if (coupons.validTill < Date.now()) {
    coupons.status = "Expired";
    await discount.save();
  }

  return res.status(200).json({
    success: true,
    message: "Coupon codes available",
    coupons,
  });
});

const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("please provide amount", 400));
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency:"inr",
  })
  console.log(amount);
  
  return res.status(201).json({
    success: true,
    clientSecret:paymentIntent.client_secret,
    message: "payment successfull",
  });
});

const getCoupon = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  let coupon;
    if (myCache.has(`coupon-wuth-${id}`)) {
      coupon = JSON.parse(myCache.get(`coupon-wuth-${id}`));
    } else {
      coupon = await Coupon.findById(id);
      myCache.set(`coupon-wuth-${id}`, JSON.stringify(coupon));
    }
    if (!coupon)
      return next(new ErrorHandler("no coupon code available", 404));

    return res.status(200).json({
      success: true,
      message: "Coupon codes available",
      coupon,
    });
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    if (myCache.has(`coupon-wuth-${id}`)) {
      myCache.del(`coupon-wuth-${id}`);
    }
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return next(new ErrorHandler("no coupon code available", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Coupon deleted",
    });
});

const updateCoupon = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    let { code, amount, validTill, status } = req.body;
    if (status === "Expired") {
        validTill = new Date(Date.now() - 24 * 60 * 60 * 1000);
    } else if (status === "Active") { 
        validTill = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    }
    const coupon = await Coupon.findByIdAndUpdate(id, { code, amount, validTill, status }, { new: true });
    myCache.set(`coupon-wuth-${id}`, JSON.stringify(coupon));
    if (!coupon) return next(new ErrorHandler("no coupon code available", 404));
    return res.status(200).json({
      success: true,
      message: "Coupon updated",
      coupon,
    });
});


export { allCoupon, applyDiscount, createPaymentIntent, getCoupon, deleteCoupon, updateCoupon, newCoupon};