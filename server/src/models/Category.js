const { DataTypes } = require("sequelize");
const sequelize = require("../config/config_db");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
}, {
  tableName: 'categories',
  timestamps: true,
});

module.exports = Category;
