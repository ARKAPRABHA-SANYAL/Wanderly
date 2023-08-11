const db = require('../database.js');
const bcrypt = require('bcrypt');

const createUserTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  return new Promise((resolve, reject) => {
    db.query(createTableQuery, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const insertUserQuery = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(insertUserQuery, [name, email, hashedPassword], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const getAllUsers = () => {
  const selectUsersQuery = `
    SELECT * FROM users
  `;

  return new Promise((resolve, reject) => {
    db.query(selectUsersQuery, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const deleteUserById = (id) => {
  const deleteUserQuery = `
    DELETE FROM users WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(deleteUserQuery, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const selectUserQuery = `
      SELECT * FROM users WHERE email = ? LIMIT 1
    `;

    db.query(selectUserQuery, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
};

const findById = (id) => {
  const findByIdQuery = `
    SELECT * FROM users WHERE id = ? LIMIT 1
  `;

  return new Promise((resolve, reject) => {
    db.query(findByIdQuery, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const user = result[0]; // Since we are using LIMIT 1, we get the first result
        resolve(user);
      }
    });
  });
};

const User = {
  createTable: createUserTable,
  createUser,
  comparePassword,
  getAllUsers,
  deleteUserById,
  findUserByEmail,
  findById,
};

module.exports = User;
