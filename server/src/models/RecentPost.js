module.exports = (sequelize,DataTypes) => {

    const RecentPost = sequelize.define("RecentPost", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },

        post_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "posts",
                key: "id",
            },
        },
        
        viewed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "recent_posts",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["user_id", "post_id"]
            }
        ]
    });
    RecentPost.associate = (models) => {
        RecentPost.belongsTo(models.User, { foreignKey: "user_id" });
        RecentPost.belongsTo(models.Post, { foreignKey: "post_id" });
    }
    return RecentPost;
}

