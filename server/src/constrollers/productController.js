const db = require("../config/config_db");
const { Post, Image, Category, SubCategory, RecentPost } = require("../models");
const path = require("path");
const fs = require("fs");

const { getIO } = require("../Socket/socket");

require('dotenv').config();

const getCategoriesEdit = async (req, res) => {
    try {
        const category = await Category.findAll({
            include: [{ model: SubCategory, as: 'subCategories' }]
        });
        res.status(200).json({ category });

    } catch (error) {
        console.error('Грешка при вземане на постове:', error);
        res.status(500).json({ message: 'Сървърна грешка' });
    }
};

const addProduct = async (req, res) => {
    const { title, description, categoryId, subCategoryId, categoryName, subCategoryName } = req.body;
    const coverImage = req.file ? req.file.filename : '';
    const userId = req.user.id;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Потребителят не е автентифициран!" });
    }

    try {
        let savedCategoryId = categoryId;
        let savedSubCategoryId = subCategoryId;

        let category = await Category.findOne({ where: { categoryName: categoryName } });

        if (!category) {
            category = await Category.create({ categoryName: categoryName });
        }
        savedCategoryId = category.id;

        let subCategory = await SubCategory.findOne({ where: { subCategoryName: subCategoryName, categoryId: savedCategoryId } });

        if (!subCategory) {
            subCategory = await SubCategory.create({ subCategoryName: subCategoryName, categoryId: savedCategoryId });
        }
        savedSubCategoryId = subCategory.id;

        const product = await Post.create({
            title,
            description,
            categoryId: savedCategoryId,
            subCategoryId: savedSubCategoryId || null,
            coverImage,
            user_id: userId
        });

        res.status(201).json({
            success: true,
            message: "Продуктът е успешно създаден!",
            postId: product.id,
            product
        });

    } catch (error) {
        console.error(" Грешка при създаването на продукт:", error);
        res.status(500).json({ success: false, error: "Вътрешна грешка на сървъра!" });
    }
};

const getIncrementPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const posts = await Post.findByPk(id);

        if (!posts) {
            return res.status(404).json({ message: "Product not found" });
        }

        posts.views = (posts.views || 0) + 1;
        await posts.save();

        if (userId) {
            await RecentPost.upsert({
                user_id: userId,
                post_id: id,
                viewed_at: new Date()
            });

            const recentPosts = await RecentPost.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Post,
                        attributes: ["id", "title", "coverImage", "views"]
                    }
                ],
                order: [["viewed_at", "DESC"]],
                limit: 5,
            });

            return res.json({ message: "Views updated", views: posts.views, recentPosts: [] });
        }
        console.log(posts.views);
        return res.json({ message: "Views updated", views: posts.views });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error", error });
    }
}

const getRecentPosts = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(403).json({ message: "User not authenticated" });
        }
        const recentPosts = await RecentPost.findAll({
            where: { user_id: userId },
            include: [{ model: Post, attributes: ['id', 'title', 'coverImage', 'views'] }],
            order: [["viewed_at", "DESC"]],
            limit: 5
        });

        return res.json({ recentPosts });
    } catch (error) {
        console.log("Error fetching recent posts:", error);
        return res.status(500).json({ message: "Server error fetching recent posts" });
    }
};

const getPostIdImages = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Невалиден идентификатор на публикация' });
    }

    const images = req.files;
    let { descriptions } = req.body;

    if (!images || images.length === 0) return res.status(400).json({ error: 'Няма качени файлове' });

    if (typeof descriptions === 'string') {
        descriptions = JSON.parse(descriptions);
    }

    if (!Array.isArray(descriptions)) {
        descriptions = [];
    }

    try {
        const postExist = await Post.findOne({ where: { id } });

        if (!postExist) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const imagePromises = images.map((image, index) => {
            return Image.create({ post_id: id, image_url: image.filename, descriptions: descriptions[index] || '' });
        });

        await Promise.all(imagePromises);
        res.status(201).json({ message: 'Images uploaded successfully', postId: id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

const getAllProducts = async (req, res) => {

    try {
        const posts = await Post.findAll({

            include: [
                { model: Category, as: 'category' },
                { model: SubCategory, as: 'subCategory' }
            ]
        });

        res.status(200).json(posts);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const getProductId = async (req, res) => {
    const postId = req.params.id;

    try {
        const postDetails = await Post.findOne({
            where: { id: postId },
            attributes: ['title', 'coverImage', 'description', 'categoryId', 'subCategoryId'],
            include: [
                { model: Category, as: 'category', attributes: ['id', 'categoryName'] },
                { model: SubCategory, as: 'subCategory', attributes: ['id', 'subCategoryName'] }
            ]
        });

        if (!postDetails || postDetails.length === 0) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const imageDetails = await Image.findAll({
            where: { post_id: postId },
            attributes: ['image_url', 'descriptions']
        });

        res.json({
            success: true,
            postId,
            postDetails,
            category: postDetails.category,
            subCategory: postDetails.subCategory,
            imageDetails,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const getProductVerify = async (req, res) => {

    try {
        const [resultVerify] = await db.query("SELECT * FROM posts WHERE is_verified = TRUE");

        if (!resultVerify || resultVerify.length === 0) {
            return res.status(404).json({ error: "No verified products found." });
        }

        res.status(200).json({
            success: true,
            message: "Verified posts fetched successfully.",
            posts: resultVerify,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "An error occurred while fetching verified products." });
    }
}

const verifyPostAdmin = async (req, res) => {
    const postId = req.params.id;

    if (!postId) {
        return res.status(500).json({ error: "Error fetching product", result });
    }
    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        await post.update({ is_verified: true });
        getIO().emit('update', { id: post.id, is_verified: post.is_verified });

        res.json({ success: true, message: 'Post verified successfully' });

    } catch (error) {
        console.error(error);
        return res.status(403).json({ success: false, message: 'Server error' });
    }
}

const deletePostId = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });

        const post = await Post.findByPk(postId, {
            include: [
                { model: Image, as: 'Images' },
                { model: Category, as: 'category' },
                { model: SubCategory, as: 'subCategory' }
            ]
        });

        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const imageUrl = post.coverImage;
        const postImage = post.Images;
        const categoryId = post.categoryId;
        const subCategoryId = post.subCategoryId;

        await Image.destroy({ where: { post_id: postId } });
        await Post.destroy({ where: { id: postId } });
        const postCategoryId = await Post.findOne({ where: { categoryId } });
        const postSubCategoryId = await Post.findOne({ where: { subCategoryId } });

        if (!postCategoryId) {
            await Category.destroy({ where: { id: categoryId } })
        }

        if (!postSubCategoryId) {
            await SubCategory.destroy({ where: { id: subCategoryId } })
        }

        if (imageUrl) {
            const mainImagePath = path.join(__dirname, 'uploads', imageUrl);
            if (fs.existsSync(mainImagePath)) {

                fs.unlink(mainImagePath, (err) => {
                    if (err) {
                        console.log('Error deleting uploaded', err);
                    }
                });
            }
        }

        if (postImage.length > 0) {
            postImage.forEach(({ image_url }) => {
                const imagePath = path.join(__dirname, 'uploads', image_url);
                if (fs.existsSync(imagePath)) {

                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.log('Error deleting additional image:', err);
                        }
                    });
                }
            });
        }
        getIO().emit("deletePost", postId);

        res.status(200).json({ success: true, message: 'Успешно изтриване на' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const updatePost = async (req, res) => {
    const { id } = req.params;
    let { title, description, categoryId, subCategoryId } = req.body;

    try {
        const post = await Post.findByPk(id);
        if (!post) return res.status(404).json({ error: "Постът не е намерен" });

        const updaterow = {
            title,
            description,
            categoryId: categoryId || null,
            subCategoryId: subCategoryId || null
        };

        if (req.file) updaterow.coverImage = req.file.path;

        await Post.update(updaterow, { where: { id } });

        if (req.files && req.files.newImages) {
            const newImgs = req.files.newImages.map(file => ({ post_id: id, image: file.path }));
            await Image.bulkCreate(newImgs);
        }

        const updatedPost = await Post.findByPk(id, { include: [Image] });

        return res.status(200).json({ message: "Постът е успешно обновен", post: updatedPost });

    } catch (error) {
        console.error("Грешка при обновяване на пост:", error);
        return res.status(500).json({ error: "Вътрешна грешка на сървъра" });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductId,
    verifyPostAdmin,
    getProductVerify,
    deletePostId,
    getPostIdImages,
    updatePost,
    getIncrementPost,
    getRecentPosts,
    getCategoriesEdit
}