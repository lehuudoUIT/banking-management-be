require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      useUTC: false, // for reading from database
    },
    timezone: process.env.DB_TIMEZONE, // for writing to database
  },
  test: {
    username: "root",
    password: null,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_PORT,
  },
  production: {
    username: "root",
    password: null,
    database: process.env.DB_DATABASE_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_PORT,
  },
};
