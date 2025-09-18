
module.exports = (sequelize, DataTypes) => {
    
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
            unique: true,
            validate: {
                isEmail: true
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user"
        },

        online: { type: DataTypes.BOOLEAN, defaultValue: false }

    }, {
        tableName: 'users',
        timestamps: true
    })
    User.associate = (models) => {
        User.hasMany(models.Post, { foreignKey: 'user_id' });
    }
    return User;
}