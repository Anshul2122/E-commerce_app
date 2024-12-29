import express from 'express';
import { upload } from '../middleware/multer.middleware.js';
import { adminOnly, isAuthenticatedUser } from '../middleware/auth.middleware.js';
import { deleteProduct, getAdminProducts, getAllCategoryProducts, getAllProducts, getCategoryProduct, getlatestProducts, getSingleProduct, newProduct, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

//localhost:{port}/api/v1/product

router.route('/new').post(isAuthenticatedUser , adminOnly, upload.array("photos", 5), newProduct) // new product by admin only
router.route('/all').get(getAllProducts)   // get all products
router.route('/latest').get(getlatestProducts) // get latest product
router.route('/categories').get(getAllCategoryProducts) // get all categories
router.route("/category-products").get(getCategoryProduct);  // get specific category products
router.route('/admin-products').get(isAuthenticatedUser, adminOnly, getAdminProducts) // get admin products 
router.route('/:id').get(isAuthenticatedUser, adminOnly,getSingleProduct).put(isAuthenticatedUser, adminOnly,upload.array("photos", 5), updateProduct).delete(isAuthenticatedUser, adminOnly, deleteProduct) // get single produt , update product by admin, delete product by admin
router.route('/reviews/:id') // all reviews of products
router.route('/reviews/new/:id') // new review
router.route('/review/:id')   // delete review




export default router;