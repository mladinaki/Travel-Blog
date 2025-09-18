const { Sequelize } = require("sequelize");
require('dotenv').config();

const db = new Sequelize(
    process.env.DB_NAME || "db_blog_now",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "mladinaki123",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false
    }
);

(async () => {
    try {
        await db.authenticate();
        await db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'db_blog_now'};`);
        console.log("Database connected and ready to localhost 3500.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

module.exports = db;
