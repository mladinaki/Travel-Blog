const { DataTypes } = require("sequelize");
const sequelize = require("../config/config_db");

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

module.exports = SubCategory;
