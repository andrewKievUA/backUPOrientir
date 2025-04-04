

import cheerio from 'cheerio'
import mysql from 'mysql2'
import cron from 'node-cron'
import axios from 'axios'


const connection =  mysql.createPool({
  "host": "192.168.10.254",
  "user": "root",
  "password": "8Bw78Yk9",
  "database": "stat"
});

let correct = 0
let incorrect = 0
cron.schedule("0 0 0 * * *", () => {
  correct = 0
  incorrect = 0
})

cron.schedule("0 */21 * * * *", () => {
  axios.get('https://whitebit.com/api/v1/public/ticker?market=USDT_UAH').then(function (response) {
    console.log("whitebit USDT_UAH", response.data.result.bid.slice(0, 5));
    connection.query(
      `UPDATE stat.money SET USDEXMO = ${parseFloat(response.data.result.bid.slice(0, 5))} WHERE (id = '1')`,
      function (err, results, fields) { }
    );
  }).catch((error) => console.log(error))
})

cron.schedule("0 */20 * * * *", () => {
  senseBank()
})
senseBank()

const apiKey = '666fc89d1d6f4ce6a93eb49cd8e47229'; // замените на свой API-ключ Open Exchange Rates
const senseBankCurrencyCode = 'USD'; // код валюты Sense Bank

axios.get(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${senseBankCurrencyCode}`)
  .then(response => {
    console.log(response.data);
    const senseBankCurrencyRate = response.data.rates[senseBankCurrencyCode];
    console.log(`Курс валюты Sense Bank: ${senseBankCurrencyRate}`);
  })
  .catch(error => {
    console.error(error);
  });

function senseBank() {
  console.log("senseBank")

  let ret = []
  axios.get('https://minfin.com.ua/ua/company/sensebank/')
    .then(response => {
      const $ = cheerio.load(response.data);
      ret.push($('tbody tr:last-child td:nth-child(2)').text().substring(0, 4))
      ret.push($('tbody tr:last-child td:last-child').text().substring(0, 4))
      ret.push($('tbody tr:first-child td:nth-child(2)').text().substring(0, 4))
      ret.push($('tbody tr:first-child td:last-child').text().substring(0, 4))
      let str = `UPDATE stat.money SET USDBUY = ${ret[0]}, USDSELL = ${ret[1]},  EUROBUY = ${ret[2]}, EUROSELL = ${ret[3]}  WHERE (id = '1')`
      console.log("senseBank STR", str)
      connection.query(
        str,
        function (err, results, fields) {
          if (err) return console.log("connection closed due to errors", err)
        }
      );
    })
    .catch(error => {
      console.log(error);
    });
}