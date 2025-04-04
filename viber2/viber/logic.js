const downloadImageToweb = require('./models/downloadImageToweb')
const downloadImageToLocal = require('./models/downloadImageToLocal')

const downloadImageToLocalCamera = require('./models/downloadImageToLocalCamera')
const newUser = require('./mysql/newUser.js');
const checkStatusUser = require('./mysql/checkStatusUser.js');
const mysqlStat_UsingBot = require('./mysql/mySqlSelect');
const createMessageData = require('./models/messageUtils');
const insertData = require("./mysql/mysqlInsert")
const PictureMessage = require('viber-bot').Message.Picture;
const url = require('viber-bot').Message.Url;
const text = require('viber-bot').Message.Text;
const keys = require('./keyboard.js');
const TextMessage = require('viber-bot').Message.Text;
const currentYear = new Date().getFullYear();
const { parse } = require('date-fns');

const commandsInfo = {
    '1': 'Download and send two images from the local camera.',
    '2': 'Download and send the second image from the local camera.',
    '3': 'Download and send two images from another camera source.',
    '9': 'Download image from the main camera and send it as a PictureMessage.',
    '11': 'Download image from the Tokarka camera and send it as a PictureMessage.',
    '12': 'Download image from the Tokarka2 camera and send it as a PictureMessage.',
    '22': 'Download image from the trans camera and send it as a PictureMessage.',
    '7': 'Retrieve and send a summary of rezka_otklonenie data.',
    '98': 'Retrieve and send the list of Viber users with their status.',
    '99': 'Retrieve and send the last 40 messages with timestamps and sender names.',
    '104': 'Send a report of bot usage count per user.',
    '>60000': 'Toggle the user status between active and blocked (restricted to specific users).',
    'info': 'Show this list of all available commands.'
};


async function logic(botResponse, text_received, connection) {
    if (currentYear <= 2025) {
        let text_received_l = text_received
        let message;
        let sender_name = botResponse.userProfile.name;
        let sender_id = botResponse.userProfile.id;

        await checkStatusUser(sender_id, connection, (error, userResult) => {
            if (error) { console.error('Error:', error); return; }
            if (userResult.status === 9) {
                newUser({ name: sender_name, id_viber: sender_id }, connection)
                insertData(createMessageData(sender_name, text_received, sender_id), connection)
                console.log('User Result === No exsist')
            }
            if (userResult.status === 0 || userResult.status === 1) {
                console.log('User  exsist', userResult.name)
                sender_name = userResult.name
                insertData(createMessageData(sender_name, text_received, sender_id), connection)
            }

            if (userResult.status === 0 || userResult.status === 9) {
                console.log('DENIED')
                message = new text(`нажаль Вам доступ був заблокован, З питань доступу звертайтесь до Славінського`);
                botResponse.send(message)
                botResponse.send(keys)
            }
            if (userResult.status === 1) { logicBot(text_received_l, sender_name, botResponse, connection) }
        });
    }
}

async function processQueryAndSendResults(query, connection, botResponse, keys) {
    try {
        const results = await mysqlStat_UsingBot(query, connection);
        let txt = "Запросов к Боту от: \r\n";
        results.map((row) => {
            txt += row.name + "(" + row.count + ")\r\n";
        });
        const message = new TextMessage(txt);
        await botResponse.send(message);
        await botResponse.send(keys);
    } catch (error) {
        console.error(error);
    }
}


async function logicBot(text_received_l, sender_name, botResponse, connection) {
    if (text_received_l == '1') {

        await downloadImageToLocal(1, 254)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            // message = new TextMessage(req.secure_url); 
            message = new url(req.secure_url);
            // await botResponse.send(message);
            // message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
        }, 900)

        await downloadImageToLocal(2, 254)
        setTimeout(async () => {
            const req = await downloadImageToweb(2)
            //   message = new TextMessage(req.secure_url);

            message = new url(req.secure_url);
            //   message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
        }, 2500)
    }

    else if (text_received_l == '2') {
        await downloadImageToLocal(2, 254)
        setTimeout(async () => {
            const req = await downloadImageToweb(2)
            message = new url(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
        }, 1000)
    }



    if (text_received_l == '3') {

        await downloadImageToLocal(1, 166)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            // message = new TextMessage(req.secure_url); 
            message = new url(req.secure_url);
            // await botResponse.send(message);
            // message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
        }, 900)

        await downloadImageToLocal(2, 166)
        setTimeout(async () => {
            const req = await downloadImageToweb(2)
            //   message = new TextMessage(req.secure_url);

            message = new url(req.secure_url);
            //   message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
        }, 2500)
    }



    if (text_received_l === 'info') {
        let infoMessage = "Available Commands:\n";
        for (const [command, description] of Object.entries(commandsInfo)) {
            infoMessage += `${command}: ${description}\n`;
        }
        const message = new TextMessage(infoMessage);
        await botResponse.send(message);
        await botResponse.send(keys);
    }

    else if (text_received_l === '104') {
        const query = `SELECT name, COUNT(*) AS count FROM viber GROUP BY name ORDER BY count DESC`;
        processQueryAndSendResults(query, connection, botResponse, keys);
    }

    else if (text_received_l === '99') {
        // const quer = `SELECT name, COUNT(*) AS count FROM viber GROUP BY name ORDER BY count DESC`;
        // processQueryAndSendResults(quer, connection, botResponse, keys);

        const query = `SELECT name, time,text FROM viber ORDER BY id DESC LIMIT 70 `;
        mysqlStat_UsingBot(query, connection)
            .then(async (results) => {
                let txt = "Имя Время Текст \r\n"
                results.map((row) => {
                    let name = ""
                    row.name == "Александр Славинский" ? name = "Славинск" : name = row.name
                    txt += name + "   (" + row.time + ") (" + row.text + ")\r\n"
                })
                message = new TextMessage(txt);
                await botResponse.send(message);
                await botResponse.send(keys)
            })
            .catch((error) => {
                console.error(error);
            });
    }


    else if (text_received_l === '9') {
        await downloadImageToLocalCamera(`http://192.168.10.254:3000/camera`)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
            setTimeout(async () => { botResponse.send(keys) }, 2000)
        }, 1000)
    }

    // http://192.168.10.254:3000/cameraTokarka
    // const url = `http://192.168.10.254:3000/camera`

    else if (text_received_l === '11') {
        await downloadImageToLocalCamera(`http://192.168.10.254:3000/cameraTokarka`)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
            setTimeout(async () => { botResponse.send(keys) }, 2000)
        }, 1000)
    }

    else if (text_received_l === '12') {
        await downloadImageToLocalCamera(`http://192.168.10.254:3000/cameraTokarka2`)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
            setTimeout(async () => { botResponse.send(keys) }, 2000)
        }, 1000)
    }

    else if (text_received_l === '13') {
        await downloadImageToLocalCamera(`http://192.168.10.254:3000/kkran`)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
            setTimeout(async () => { botResponse.send(keys) }, 2000)
        }, 1000)
    }

        else if (text_received_l === '22') {
        await downloadImageToLocalCamera(`http://192.168.10.254:3000/trans`)
        setTimeout(async () => {
            const req = await downloadImageToweb(1)
            message = new PictureMessage(req.secure_url);
            await botResponse.send(message)
            await botResponse.send(keys)
            setTimeout(async () => { botResponse.send(keys) }, 2000)
        }, 1000)
    }


    else if (text_received_l === '98') {
        const query = `SELECT id,name,status FROM stat.viber_user order by status desc;`;
        mysqlStat_UsingBot(query, connection)
            .then(async (results) => {
                let txt = "id  Name  Status  \r\n"
                results.map((row) => {
                    let name = ""
                    let status
                    if (row.status === 0) { status = 'блоковано' } else { status = 'активно' }
                    txt += name + "(" + row.id + ")-" + row.name + "  (" + status + ")\r\n"
                })
                message = new TextMessage(txt + "+60000 добавить к Id 60010");
                await botResponse.send(message);
                await botResponse.send(keys)
            })
            .catch((error) => {
                console.error(error);
            });
    }



    else if (text_received_l === '7') {
        // const query = `SELECT id,name,status FROM stat.viber_user order by status desc;`;
        let query = `SELECT time,start,end,gape,diff FROM stat.rezka_otklonenie order by id desc`
        mysqlStat_UsingBot(query, connection)
            .then(async (results) => {
                let txt = ""
                results.map((row) => {
                    // console.log(timestampToDateTime(row.time));
                    txt += row.time + " начало:" + row.start + " конец:" + row.end + " разн:" + row.gape + " откл:" + row.diff + ")\r\n"
                })
                message = new TextMessage(txt);
                await botResponse.send(message);
                await botResponse.send(keys)
            })
            .catch((error) => {
                console.error(error);
            });
    }



    else if (text_received_l > 60000 && text_received_l < 61000 && (sender_name === "Славинск" || sender_name === "Программист")) {
        let idUser = text_received_l - 60000

        console.log("asdfasdf", idUser);

        //UPDATE `stat`.`viber_user` SET `status` = '0' WHERE (`id` = '30');
        let select = `SELECT id,name,status FROM stat.viber_user where id = ${idUser}`
        mysqlStat_UsingBot(select, connection)
            .then(async (results) => {
                let txt = ""
                results.map((row) => {
                    let name = ""
                    let status
                    if (row.status === 0) { status = 'блоковано' } else { status = 'активно' }
                    txt += name + "(" + row.id + ")-" + row.name + "  (" + status + ")\r\n"
                })
                message = new TextMessage(txt);
                await botResponse.send(message);

                let stat
                if (results[0].status == 0) { stat = 1 }
                if (results[0].status == 1) { stat = 0 }
                mysqlStat_UsingBot(`UPDATE stat.viber_user SET status = '${stat}' WHERE (id = '${idUser}')`, connection)

                setTimeout(function () {
                    mysqlStat_UsingBot(select, connection).then(async (results) => {
                        let txt = ""
                        results.map((row) => {
                            let name = ""
                            let status
                            if (row.status === 0) { status = 'блоковано' } else { status = 'активно' }
                            txt += name + "(" + row.id + ")-" + row.name + "  (" + status + ")\r\n"
                        })
                        message = new TextMessage(txt);
                        await botResponse.send(message);
                        await botResponse.send(keys)
                    })
                }, 4000);
                await botResponse.send(keys)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    else if (text_received_l === '0') {
    }
    else {
        await botResponse.send(keys)
    }

}



module.exports = logic;