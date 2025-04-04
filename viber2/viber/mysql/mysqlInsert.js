// Create a connection to the MySQL database
// Function to insert data into MySQL
function insertData(data,connection) {
  // Insert query
  const query = 'INSERT INTO viber (name, time, text, date, time_js, viber_id) VALUES (?, ?, ?, ?, ?, ?)';
  // Execute the query
  console.log(data)
  connection.query(query, [data.name, data.time, data.text, data.date, data.timeJs, data.viber_id], (error, results, fields) => {
    if (error) {
      console.error('Error inserting data: ', error);
      return;
    }
    console.log('Data inserted successfully');
  });
  // Close the connection
//  connection.end();
}
module.exports = insertData;