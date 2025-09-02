const express = require('express');
const { authUser } = require('../middleware/authUser');
const { addComment, getCommentId, deleteComment } = require('../constrollers/commentControler');
const { likeController, countLikeController } = require('../constrollers/likeControler');
const {likeSatatusController } = require('../constrollers/likeStatusController');
const router = express.Router();

router.post('/addComment', authUser, addComment);
router.get('/addComment/:id', getCommentId);
router.delete('/addComment/delete-comment/:id',authUser, deleteComment);

//Likes         
router.post('/like/:comment_id', authUser, likeController);
router.get('/like-count/:comment_id', countLikeController);
router.post('/like-status', likeSatatusController);

module.exports = router;