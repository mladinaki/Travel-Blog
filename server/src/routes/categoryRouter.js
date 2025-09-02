const express = require('express');
const {  getCategoriesEdit } = require('../constrollers/productController');
const { getCategoriesName, getCategories, getCategoriesDropdown } = require('../constrollers/categoryController');
const { authUser } = require('../middleware/authUser');

const router = express.Router()

router.get('/posts/category/:categoryName', getCategories);
router.get('/categories', getCategoriesName);
router.get('/categoriesEdit', getCategoriesEdit);

router.get('/posts', authUser, getCategoriesDropdown);

module.exports = router