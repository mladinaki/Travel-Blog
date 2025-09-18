module.exports = (sequelize, DataTypes) => {

  const SubCategory = sequelize.define("SubCategory", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

  }, {
    tableName: 'subcategories',
    timestamps: true,

  });
  SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.Category, { foreignKey: "categoryId", onDelete: "CASCADE" });
    SubCategory.hasMany(models.Post, { foreignKey: "subCategoryId", onDelete: "CASCADE" });
  }
  return SubCategory;
}
