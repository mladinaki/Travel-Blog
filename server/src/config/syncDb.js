const db = require('../config/config_db');

require("../models/associations");

async function syncDatabase() {
    try {
        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ alter: true });
            console.log("Database synchronized successfully (alter).");
        } else {
            await db.authenticate();
            console.log("Database connection established.");
        }
    } catch (error) {
        console.error("Error synchronizing the database:", error);
    }
}

module.exports = syncDatabase;