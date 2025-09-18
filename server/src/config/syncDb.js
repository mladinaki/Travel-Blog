const db = require('../models');
const sequelize = db.sequelize;

const syncDatabase = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ alter: true });
            console.log("Database synchronized successfully (alter).");
        } else {
            await sequelize.authenticate();
            console.log("Database connection established.");
        }
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
}

module.exports = syncDatabase;