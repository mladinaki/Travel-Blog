
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_blog_now", "root", "mladinaki123", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query("CREATE DATABASE IF NOT EXISTS db_blog_now;");
    } catch (error) {
        console.error(" Database connection failed:", error);
    }
})();

const db = new Sequelize("db_blog_now", "root", "mladinaki123", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

module.exports = db;