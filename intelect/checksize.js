const cron = require('node-cron');
const sql = require("mssql");
const mysql = require('mysql');
const configHost = require("./missedSize/config.js");
const config = require('./config.json');
const updateMysql = require('./missedSize/updateMysql.js');
const missedSize = require('./missedSize/missedSize.js');
const mssqlInfo = require("./missedSize/mssqlInfo.js");

const mysqlPool = mysql.createPool(config.database);
let palletList = [];
let currentIndex = 3;

// Process a single pallet by retrieving its data and updating MySQL
async function processPallet(msSql, pallet) {
  console.log("Processing pallet:", pallet);

  const palletData = await mssqlInfo(pallet, msSql);
  if (!palletData) {
    console.log('No data found for pallet:', pallet);
    return;
  }

  console.log('Updating MySQL with pallet data');
  await updateMysql(mysqlPool, palletData);
 
}

// Fetch the list of pallets from MySQL and start processing each one every 10 seconds
async function fetchAndProcessPallets() {
  try {
    // Connect to MSSQL
    const msSql = await sql.connect(configHost.ms);

    // Get the list of pallets from MySQL
    palletList = await missedSize(mysqlPool);
    currentIndex = 1; // Reset index to 3
    console.log("Fetched pallet list:", palletList);

    if (!palletList || palletList.length === 0) {
      console.log('Pallet list is empty or not retrieved.');
      return;
    }

    // Process each pallet every 10 seconds
    const intervalId = setInterval(async () => {
      if (currentIndex >= palletList.length) {
        clearInterval(intervalId); // Stop the interval when done
        console.log("Completed processing all pallets. Waiting for next cycle.");
        return;
      }

      await processPallet(msSql, palletList[currentIndex]);
      
      currentIndex++;
    }, 20000); // 10 seconds interval

  } catch (error) {
    console.error('Error during pallet processing:', error);
  }
}

fetchAndProcessPallets()

// Schedule the job to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log("Starting pallet processing cycle every 10 minutes");
  fetchAndProcessPallets().catch(error => {
    console.error('Error in scheduled pallet processing:', error);
  });
});
