const request = require("request");
const cron = require("node-cron");
const { S7Client } = require("s7client");

let alarm = false;

const transporter = {
  hardware: {
    name: "transporter",
    host: "192.168.10.216",
    port: 102,
    rack: 0,
    slot: 2,
  },
  output: {
    start: 188,
    bit: 6,
  },
};

let clientCement = new S7Client(transporter.hardware);
clientCement.on("error ", () => {
  console.error;
  return;
});

cron.schedule("0,10,20,30,50,40 * * * * *", () => {
  ///0,10,20,30,50,40
  function check() {
    request(
      "https://vadimklimenko.com/map/statuses.json",
      function (error, response, body) {
        if (error) {
          console.error("error during connect to internet:", error);
          return;
        } 
        if (!body) {
          return;
        }

        alarm =
          Boolean(
            Object.values(
              Object.values(JSON.parse(body).states)[10].districts
            )[0].enabled
          ) |
          Object.values(JSON.parse(body).states)[10].enabled |
          false;

        async function zz() {
          try {
            await clientCement.writeVars([
              {
                type: "BOOL",
                area: "mk",
                start: transporter.output.start,
                bit: transporter.output.bit,
                value: alarm,
              },
            ]);
          } catch (err) {
            await clientCement.disconnect();
            await clientCement.connect();
            console.log("clientCement.connect", err);
            return;
          }
          try {
            // Additional logic if necessary
          } catch (err) {
            console.log("tryWriteVariebles", err);
            return;
          }

          const timing = new Date();

          const timeNaw = () => {
            const stringTime =
              timing.getHours() +
              ":" +
              timing.getMinutes() +
              ":" +
              timing.getSeconds();
            return stringTime;
          };

          if (alarm) {
            console.log(
              "Воздушная тревога происходит",
              timeNaw()
            );
          } else {
            console.log(
              timeNaw()
            );
          }
        }
        zz();
      }
    );
  }
  check();
});
