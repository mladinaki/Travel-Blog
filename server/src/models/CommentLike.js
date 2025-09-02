const { DataTypes } = require("sequelize");
const sequelize = require("../config/config_db");


const CommentLike = sequelize.define("CommentLike", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    comment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Comments",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },

    post_id: { // ⬅️ Добавено
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Posts", // увери се, че това е името на таблицата ти с публикации
            key: "id"
        },
        onDelete: "CASCADE"
    },

}, {
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'comment_id']
        }
    ]
});

module.exports = CommentLike;
