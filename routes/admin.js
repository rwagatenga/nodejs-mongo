const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is_auth');

//const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();

// const products = [];

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
//router.post('/add-product', isAuth, adminController.postAddProduct);
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    //body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
);

// Admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

// Admin/edit-product => POST
//router.post('/edit-product/', isAuth, adminController.postEditProduct)
router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    //body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

//Admin/delete-product => POST
//router.post('/delete-product/', isAuth, adminController.postDeleteProduct)
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
//exports.products = products;
