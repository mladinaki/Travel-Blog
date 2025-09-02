    const { DataTypes } = require("sequelize");
    const sequelize = require("../config/config_db");
    const Category = require("./Category");
    const User = require("./User"); // ✅ Добавен модел User
    const SubCategory = require("./SubCategory");

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

    module.exports = Post;
