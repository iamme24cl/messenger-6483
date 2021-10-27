const dbConfig = require("../config/db.config.js");
const Sequelize = require('sequelize');

const db = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
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