const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'pallet_user',
  password: 'pallet_password',
  database: 'pallet_db'
});

connection.connect();

const query = `
  SELECT * 
  FROM pallet_db.p
  WHERE pallet_year = 2025 
    AND pallet_month = 2 
    AND id < '428292'
  ORDER BY id ASC
`;

connection.query(query, (error, results) => {
  if (error) throw error;

  // Сохранение в JSON
  fs.writeFileSync('D:/result.json', JSON.stringify(results, null, 2));

  // Сохранение в CSV
  const csv = results.map(row => Object.values(row).join(',')).join('\n');
  fs.writeFileSync('D:/result.csv', csv);
});

connection.end();