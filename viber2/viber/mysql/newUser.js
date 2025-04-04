// Create a connection to the MySQL database
// Function to insert data into MySQL
function newUser(data,connection) {
   // console.log("new user started", data);
    const query = 'INSERT INTO stat.viber_user (name, id_viber) VALUES (?, ?)';

    console.log(data)
    connection.query(query, [data.name, data.id_viber], (error, results, fields) => {
      if (error) {
        console.error('Error inserting data: ', error);
        return;
      }
      console.log('Data inserted successfully');
    });

  }
  module.exports = newUser;