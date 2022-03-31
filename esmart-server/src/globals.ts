require('dotenv').config();

export const DB = {
  DB_STRING: process.env.MONGO_CONNECTION_STRING || '',
};

export const API = {
  PORT: process.env.PORT || 4000,
};

export const AUTH = {
  SECRET: process.env.SECRET || '',
};

export const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ALLOWED: 405,
  SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
};
