const { DataTypes, Sequelize } = require('sequelize');

const sequelize = require('../config/config_db');
const Post = require('../models/Post');
const Comment = require('../models/Comments');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,

        validate: {
            isEmail: true
        },
        indexes: [{
            unique: true,
            fields: ['email']
        }]
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user" 
    }

}, {
    tableName: 'users',
    timestamps: true
})

User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });


module.exports = User