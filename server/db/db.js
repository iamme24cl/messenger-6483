const Sequelize = require("sequelize");

const dbConfig = require('../config/db.config.js');

// const db = new Sequelize(process.env.DATABASE_URL || "postgres://localhost:5432/messenger", {
//   logging: false
// });

const db = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0
});

(async () => {
  try {
    await db.authenticate();
    console.log('Connection has been successfully established')
  } catch (error) {
    console.log('Unable to connect to the database:', error);
  }
})();

module.exports = db;
