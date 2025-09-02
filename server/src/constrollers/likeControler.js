const CommentLike = require("../models/CommentLike");

const likeController = async (req, res) => {
    const { comment_id } = req.params;
    const { post_id } = req.body;
    const user_id = req.user.id;

    try {

        if (!post_id) {
            return res.status(400).json({ message: "Липсва ID на публикацията" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Няма токен или потребител" });
        }

        const [like, created] = await CommentLike.findOrCreate({
            where: { user_id, comment_id },
            defaults: { post_id }

        });

        if (!created) {
            await like.destroy();
            const count = await CommentLike.count({ where: { comment_id } });
            return res.json({ liked: false, count });
        }

        const count = await CommentLike.count({ where: { comment_id } });
        res.json({ liked: true, count });
    } catch (error) {
        res.status(500).json({ message: "Грешка при харесване", error: error.message });
    }
};

const countLikeController = async (req, res) => {
    const { comment_id } = req.params;

    try {
        const count = await CommentLike.count({
            where: { comment_id }
        });
        

        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Грешка при преброяване на харесванията", error });
    }
};

module.exports = { likeController, countLikeController };