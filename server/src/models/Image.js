module.exports = (sequelize, DataTypes) => {

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
    Image.associate = (models) => {
        Image.belongsTo(models.Post, { foreignKey: "post_id", onDelete: "CASCADE" });
    }
    return Image;
}