const path = require("path");
const { Category, Post, Image, SubCategory } = require("../models");
const fs = require("fs");
const { getIO } = require("../Socket/socket");

const deletePostId = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) return res.status(400).json({ success: false, message: "Post ID is required" });

        const post = await Post.findByPk(postId, {
            include: [
                { model: Image, as: 'Images' },
                { model: Category, as: 'category' },
                { model: SubCategory, as: 'subCategory' }
            ]
        });

        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        const { imageUrl, postImage, categoryId, subCategoryId } = post

        await Image.destroy({ where: { post_id: postId } });
        await Post.destroy({ where: { id: postId } });

        const postCategoryId = await Post.findOne({ where: { categoryId } });
        const postSubCategoryId = await Post.findOne({ where: { subCategoryId } });

        if (!postSubCategoryId) {
            await SubCategory.destroy({ where: { id: categoryId } })
        }

        if (!postCategoryId) {
            await Category.destroy({ where: { id: categoryId } })
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

        if (post.Images && post.Images.length > 0) {
            post.Images.forEach(({ image_url }) => {
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
module.exports = deletePostId;