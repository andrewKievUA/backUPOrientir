

const mysql = require('mysql')
const config = require("./config");
const axios = require('axios')
const cron = require("node-cron");


const connection = mysql.createConnection(config.dbConfig);


cron.schedule("0 17 * * * *", () => {
    getWeatherForecast()



})





async function getWeatherForecast() {
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Brovary,ua&appid=${config.API_KEY}&units=metric`);
    const data = response.data;
    console.log(`http://api.openweathermap.org/data/2.5/forecast?q=Brovary,ua&appid=${config.API_KEY}&units=metric`);
    //console.log(data);
    let temperatures = [];
    let weatherNumbers = [];
    let wind = [];
    let days = [];
    let daysOwWeek = [];
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
     for (let i = 0; i < data.list.length; i += 8) {
       const date = new Date(data.list[i].dt_txt);

       console.log(`Date: ${date.getDay()}`);

       const dayIndex = date.getDay();
       const dayOfWeek = daysOfWeek[dayIndex]
       console.log(`Date: ${dayOfWeek}`);
       
      console.log(`Date: ${date.getDate()}`);
       days.push(date.getDate());
       daysOwWeek.push(dayOfWeek);


       
       wind.push(Math.round(data.list[i].wind.speed))
   
      console.log(`wind: ${data.list[i].wind.speed}`);
      console.log(`Temperature: ${data.list[i].main.temp}°C`);

      temperatures.push(Math.round(data.list[i].main.temp));
      const weather = data.list[i].weather[0].description;
      console.log(`Weather: ${weather}`);
      switch (weather) {
        case 'clear sky':
          weatherNumbers.push(1);
          break;
        case 'few clouds':
          weatherNumbers.push(1);
          break;
        case 'scattered clouds':
          weatherNumbers.push(2);
          break;

          case 'overcast clouds':
            weatherNumbers.push(2);
            break;

        case 'broken clouds':
          weatherNumbers.push(2);
          break;

        case 'shower rain':
          weatherNumbers.push(3);
          break;
        case 'rain':
          weatherNumbers.push(3);
          break;
        case 'thunderstorm':
          weatherNumbers.push(3);
          break;

          

          case 'light rain':
            weatherNumbers.push(3);
            break;


            


            
          case 'moderate rain':
            weatherNumbers.push(3);
            break;


        case 'light snow':
          weatherNumbers.push(4);
          break;

          case 'snow':
            weatherNumbers.push(4);
            break;

        default:
          weatherNumbers.push(0);
      }
      console.log('\n');
     }



    console.log(`Array of Temperatures: [${temperatures}]`);
    console.log(`Array of Weather Numbers: [${weatherNumbers}]`);
    console.log(`Array of Days: [${days}]`);
    console.log(`Array of wind: [${wind}]`);

    connection.connect(function (err) {
      if (err) throw err;
      console.log("Connected to the database!");
      for (let i = 0; i < temperatures.length; i++) {
        const sql = `UPDATE weather_forecast SET  temperature = ${temperatures[i]}, wind = ${wind[i]}, rain = ${weatherNumbers[i]},  date = ${days[i]} WHERE id=${[i+1]}`;
		 console.log(sql );
        connection.query(sql, function (err, result) {
          if (err) {throw err
 console.log(err)} ;
          console.log("Data updated in the database");
          
        });
      }
    });
  } catch (error) {
    console.log("Data inserted into the database",error)
    return
  }}


getWeatherForecast()

