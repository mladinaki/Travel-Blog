module.exports = (sequelize,DataTypes) => {
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
                model: "Posts",
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
    CommentLike.associate = (models) => {
        CommentLike.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
        CommentLike.belongsTo(models.Comment, { foreignKey: "comment_id", onDelete: "CASCADE" });
        CommentLike.belongsTo(models.Post, { foreignKey: "post_id", onDelete: "CASCADE" });
    }
    return CommentLike
}