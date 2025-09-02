const express = require('express');

const { getAllProducts,
    getProductId,
    addProduct,
    verifyPostAdmin,
    deletePostId,
    getPostIdImages,
    getProductVerify,
    updatePost,
    // getCategoryes,
    getIncrementPost,
    getRecentPosts,
    getCategoriesDropdown,
    // getCategories,
    // getCategoriesName,
    // getCategoriesEdit
} = require('../constrollers/productController');

const { authUser } = require('../middleware/authUser');
const upload = require('../Utils/multerUpload');

const router = express.Router();

router.post('/product', authUser, upload.single('coverImage'), addProduct);
router.get('/verify-admin', getProductVerify);
router.get('/get', getAllProducts);
router.get('/get/:id', getProductId);
router.post('/get/:id/images', upload.array('images', 5), getPostIdImages);
router.put('/verify/:id',authUser, verifyPostAdmin);
router.delete('/remove/post/:id', deletePostId);
router.put('/edit/post/:id', upload.single('coverImage'), updatePost);
router.put('/getincrement/:id',authUser, getIncrementPost);
router.get('/getrecent/views', authUser, getRecentPosts);
// router.get('/posts', authUser, getCategoriesDropdown);

// router.get('/posts/category/:categoryName', getCategories);
// router.get('/categories', getCategoriesName);
// router.get('/categoriesEdit', getCategoriesEdit);

module.exports = router;