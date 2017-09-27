var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'D132263c@',
  database: 'tcic'
});

connection.connect(function(err) {
  if (err) throw err
  console.log('Database Connection Successful!');
});
connection.query('USE tcic');

module.exports = connection;
