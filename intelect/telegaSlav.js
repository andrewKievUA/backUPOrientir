// index.js
const { scheduleCronTasks, executeQueryAndSendReport } = require('./telegaSlav/cronTasks');

// Schedule cron jobs
scheduleCronTasks();

// Run the initial night shift query
executeQueryAndSendReport(true);

const http = require('http');
const PORT = 3073;
const requestHandler = (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});