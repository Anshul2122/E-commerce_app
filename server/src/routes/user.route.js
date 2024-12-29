import express from 'express';
import {loginUser, logoutUser, registerUser, updatepassword, updateProfile, getUserDetails} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { isAuthenticatedUser } from '../middleware/auth.middleware.js';

const router = express.Router();

//localhost:{port}/api/v1/user

router.route("/register").post(upload.single("avatar") ,registerUser );
router.route("/login").post(loginUser)
router.route("/logout").post(isAuthenticatedUser, logoutUser);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatepassword)



export default router;