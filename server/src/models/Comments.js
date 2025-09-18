

module.exports = (sequelize, DataTypes) => {

    const Comment = sequelize.define("Comment", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Posts",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
    Comment.associate = (models) => {
        Comment.belongsTo(models.User, { foreignKey: "user_id", as: "author" });
        Comment.belongsTo(models.Post, { foreignKey: "post_id", onDelete: "CASCADE" });
    }
    return Comment;
}

