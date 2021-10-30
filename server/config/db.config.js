require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB } = process.env

module.exports = {
  HOST: DB_HOST,
  USER: DB_USERNAME,
  PASSWORD: DB_PASSWORD,
  DB: DB,
  dialect: "postgres"
};
