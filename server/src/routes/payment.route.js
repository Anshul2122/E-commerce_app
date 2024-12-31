import express from "express";
import {
  adminOnly,
  isAuthenticatedUser,
} from "../middleware/auth.middleware.js";
import {
    allCoupon,
    applyDiscount,
    createPaymentIntent,
    deleteCoupon,
    getCoupon,
    newCoupon,
    updateCoupon
} from "../controllers/payment.controller.js";


const router = express.Router();

//localhost:{port}/api/v1/payment

router.route("/coupon/new").post(isAuthenticatedUser, adminOnly, newCoupon);
router.route("/discount").get(isAuthenticatedUser, applyDiscount);
router.route("/coupon/all").get(isAuthenticatedUser, adminOnly, allCoupon);
router.route("/create").post(isAuthenticatedUser, createPaymentIntent);
router
  .route("/coupon/:id")
  .get(isAuthenticatedUser, adminOnly, getCoupon)
  .put(isAuthenticatedUser, adminOnly, updateCoupon )
  .delete(isAuthenticatedUser, adminOnly, deleteCoupon);

export default router;
