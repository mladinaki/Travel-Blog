module.exports = (sequelize, DataTypes) => {

  const Category = sequelize.define("Category", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    categoryName: {
      type: DataTypes.STRING,
      allowNull: false
    }

  }, {
    tableName: 'categories',
    timestamps: true
  })
  Category.associate = (models) => {
    Category.hasMany(models.SubCategory, { foreignKey: "categoryId", onDelete: "CASCADE" });
    Category.hasMany(models.Post, { foreignKey: "categoryId", onDelete: "CASCADE" });
  }
  return Category;
}

