import express from "express";
import {
  adminOnly,
  isAuthenticatedUser,
} from "../middleware/auth.middleware.js";
import {
    deleteOrder,
    getAllOrders,
    getSingleOrder,
    myOrders,
    newOrder,
    processOrder
} from "../controllers/order.controller.js";

const router = express.Router();

//localhost:{port}/api/v1/order

router.route("/new").post(isAuthenticatedUser, newOrder)
router.route('/all').get(isAuthenticatedUser, adminOnly, getAllOrders)
router.route("/my").get(isAuthenticatedUser, myOrders);
router.route('/:id')
    .get(isAuthenticatedUser, adminOnly, getSingleOrder)
    .put(isAuthenticatedUser, adminOnly, processOrder)
    .delete(isAuthenticatedUser, adminOnly, deleteOrder) 


export default router;
