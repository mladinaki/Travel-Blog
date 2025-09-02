const { Op } = require("sequelize");
const CommentLike = require("../models/CommentLike");
const Comment = require("../models/Comments");

const likeSatatusController = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user?.id || null;

    try {
        const comments = await Comment.findAll({
            where: { post_id },
            attributes: ['id']
        });

        const commentIds = comments.map(c => c.id);
           if (!commentIds.length) return res.json({});

        const likes = await CommentLike.findAll({
            where: { comment_id: { [Op.in]: commentIds } },
            attributes: ['comment_id', 'user_id']
        });

        const likeData = {};

        for (const commentId of commentIds) {
            const allLikesForComment = likes.filter(l => l.comment_id === commentId);
            const liked = user_id ? allLikesForComment.some(l => l.user_id === user_id) : false;

            likeData[commentId] = {
                liked,
                count: allLikesForComment.length
            };
        }
        return res.json(likeData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Вътрешна грешка" });
    }
}

module.exports = { likeSatatusController };