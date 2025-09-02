const { DataTypes } = require("sequelize");
const sequelize = require("../config/config_db");

const Image = sequelize.define("Image", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descriptions: {
        type: DataTypes.TEXT,
        allowNull: true

    },
    post_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
}, {
    tableName: 'images',
    timestamps: true
});

module.exports = Image;