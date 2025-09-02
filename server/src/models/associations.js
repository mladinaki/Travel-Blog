const sequelize = require("../config/config_db");
const User = require("./User");
const Post = require("./Post");
const Category = require("./Category");
const Image = require("./Image");
const SubCategory = require("./SubCategory");
const RecentPost = require("./RecentPost");
const Comment = require("./Comments");
const CommentLike = require('./CommentLike');

// Връзка между потребители и постове
User.hasMany(Post, { foreignKey: "user_id", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Връзка между постове и изображения
Post.hasMany(Image, { foreignKey: "post_id", onDelete: "CASCADE" });
Image.belongsTo(Post, { foreignKey: "post_id" });

// Връзка между категории и подкатегории
SubCategory.belongsTo(Category, { foreignKey: "categoryId" });

// Връзка между категории и постове
Category.hasMany(Post, { foreignKey: "categoryId", onDelete: "CASCADE" });
Post.belongsTo(Category, { foreignKey: "categoryId", onDelete: "CASCADE" });
Post.belongsTo(Category, { foreignKey: "categoryId", as: 'category', onDelete: "CASCADE" });

// Връзка между подкатегории и постове
SubCategory.hasMany(Post, { foreignKey: "subCategoryId", onDelete: "CASCADE" });
Post.belongsTo(SubCategory, { foreignKey: "subCategoryId", as: "subCategory" });
Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'categoryId' });

//RecentPosts
// RecentPost.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
// RecentPost.belongsTo(Post, { foreignKey: "post_id", onDelete: "CASCADE" });

Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });
Comment.belongsTo(Post, { foreignKey: "post_id", as: "post" });

// Потребителят може да има много харесвания (CommentLike)
User.hasMany(CommentLike, { foreignKey: "user_id", onDelete: "CASCADE" });
CommentLike.belongsTo(User, { foreignKey: "user_id" });

// Коментарът може да има много харесвания
Comment.hasMany(CommentLike, { foreignKey: "comment_id", onDelete: "CASCADE" });
CommentLike.belongsTo(Comment, { foreignKey: "comment_id" });

// RecentPosts
RecentPost.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(RecentPost, { foreignKey: "user_id", onDelete: "CASCADE" });

RecentPost.belongsTo(Post, { foreignKey: "post_id", onDelete: "CASCADE" });
Post.hasMany(RecentPost, { foreignKey: "post_id", onDelete: "CASCADE" });


module.exports = { sequelize, User, Category, Post, Image, SubCategory,Comment, RecentPost, CommentLike };

