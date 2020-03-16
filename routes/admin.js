const path = require('path');

const express = require('express');

//const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();

// const products = [];

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// Admin/edit-product => GET
router.get('/edit-product/:productId', adminController.getEditProduct)

// Admin/edit-product => POST
router.post('/edit-product/', adminController.postEditProduct)

//Admin/delete-product => POST
router.post('/delete-product/', adminController.postDeleteProduct)

module.exports = router;
//exports.products = products;
