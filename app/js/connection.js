var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Tigersblvd16',
  database: 'chatApp'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('Database Connection Successful!');
});
connection.query('USE user');

module.exports = connection;
