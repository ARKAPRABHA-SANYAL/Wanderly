const mysql = require('mysql2');

// Create a connection db
const db = mysql.createConnection({
  host: 'localhost',       // Replace with your MySQL host
  user: 'root',       // Replace with your MySQL user
  password: 'Arkaprabhabb45', // Replace with your MySQL password
  database: 'bookingapp', // Replace with your MySQL database name
  connectionLimit: 10,            // Adjust this based on your needs
});
db.connect((err)=>{
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL database!');
});
// Export the db so you can use it in other modules
module.exports = db;
