// Function that returns a promise for the database operation
function executeQuery(query,connection) {
  return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
    });
  });
}

module.exports = executeQuery;