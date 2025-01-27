const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const { newProduct, 
    getProducts, 
    getSingleProduct,
    updateProduct,
    deleteProduct } = require('../controllers/productController')

router.post('/product/new',  upload.array('images', 10), newProduct);
router.get('/product/get', getProducts);
router.get('/product/:id', getSingleProduct);
router.put('/product/update/:id', upload.array('images', 10), updateProduct);
router.delete('/product/delete/:id', deleteProduct);

module.exports = router;