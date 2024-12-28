import express from 'express';
import { adminLogin, adminLogout, deleteUser, getAllUsers, getSingleUser, updateUserRole } from '../controllers/admin.controller.js';
import { isAuthenticatedUser } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/auth.middleware.js';


const router = express.Router();


router.route("/verify").post(adminLogin);
router.route('/logout').post(isAuthenticatedUser,adminOnly, adminLogout);
router.route("/Allusers").get(isAuthenticatedUser,adminOnly, getAllUsers)
router.route("/user/:id")
.get(isAuthenticatedUser, adminOnly, getSingleUser)
.put(isAuthenticatedUser,adminOnly, updateUserRole)
.delete(isAuthenticatedUser, adminOnly, deleteUser);


export default router;