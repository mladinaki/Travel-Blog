module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define("Post", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        categoryId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'categories',
                key: "id"
            }
        },
        subCategoryId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'subcategories',
                key: "id"
            }
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: false
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: "id"
            }
        },

        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }

    }, {
        tableName: "posts",
        timestamps: true
    });
    Post.associate = (models) => {
        Post.belongsTo(models.User, { foreignKey: "user_id", onDelete: "CASCADE" });
        Post.belongsTo(models.Category, { foreignKey: "categoryId", as: 'category' });
        Post.belongsTo(models.SubCategory, { foreignKey: "subCategoryId", as: "subCategory" });
        Post.hasMany(models.Image, { foreignKey: "post_id", onDelete: "CASCADE" });
        Post.hasMany(models.RecentPost, { foreignKey: "post_id", onDelete: "CASCADE" });
        Post.hasMany(models.Comment, { foreignKey: "post_id", onDelete: "CASCADE" });
    }
    return Post;
}
