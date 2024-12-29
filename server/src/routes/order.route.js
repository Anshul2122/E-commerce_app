import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  adminOnly,
  isAuthenticatedUser,
} from "../middleware/auth.middleware.js";


const router = express.Router();


export default router;
