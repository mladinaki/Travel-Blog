const { v4: uuidv4 } = require('uuid');

const {Comment, User} = require("../models");

const addComment = async (req, res) => {
    try {
        const { post_id, text } = req.body;
        const { id: user_id, username } = req.user;

        if (!post_id || !text) {
            return res.status(400).json({ message: "Всички полета са задължителни!" });
        }

        const newComment = await Comment.create({
            id: uuidv4(),
            user_id: user_id,
            post_id: post_id,
            username: username,
            text: text,
        });
        console.log(newComment);
        return res.status(201).json({
            success: true,
            message: "Коментарът е добавен успешно!",
            comment: newComment,
        });

    } catch (error) {
        console.error('Error during comment creation:', error);
        return res.status(500).json({ message: 'Server error creating comment' });
    }
}

const getCommentId = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Comment.findAll({
            where: { post_id: id },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id','username','email']
                },
            ],
        });

        res.json({ success: true, comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ success: false, message: "Грешка при зареждането на коментарите." });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.destroy({ where: { id } });
        res.json({ success: true, message: "Коментарът е изтрит успешно!" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ success: false, message: "Грешка при изтриването на коментара." });
    }
};

module.exports = { addComment, getCommentId, deleteComment };