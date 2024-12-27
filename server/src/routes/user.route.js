import express from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router();

router.route("/register").post(upload.single("avatar") ,registerUser );



export default router;