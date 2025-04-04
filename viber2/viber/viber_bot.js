'use strict';
const ViberBot = require('viber-bot').Bot;
const TextMessage = require('viber-bot').Message.Text;
var fs = require('fs')
const ngrok = require('./get_public_url');
const checkUrlAvailability = require('./logic');
const currentYear = new Date().getFullYear();
const mysql = require('mysql');
const config = require('./config.js')
const host = {
  host: config.dbConfig.host,
  user: config.dbConfig.user,
  password: config.dbConfig.password,
  database: config.dbConfig.database
}

const connection = mysql.createPool(host);
const bot = new ViberBot({
    authToken: "506ff3cfba27e13b-1fd904b59d1e22ac-610e42d83e1d06af",
    name: " ",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVUEHs-NQ0wKtnQ23SIMDTUj04O6MZRTlh1VWzWhA&s", // It is recommended to be 720x720, and no more than 100kb.

});

// The user will get those messages on first registration
bot.onSubscribe(response => console.log(`Subscribed: ${response.userProfile.name}`));
bot.onUnsubscribe(userId => {
    console.log(`Unsubscribed: ${userId}`)
    fs.appendFile('users.txt', "{" + `${userId}` + ":" + `Unsubscribed`, (err) => {
        if (err) throw err;
        console.log('Data has been added!');
    });
})



bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) => {
    onFinish(new TextMessage(`Доброго дня`))
    console.log(`userProfile`, userProfile.id, userProfile.name)
    fs.appendFile('new.txt', "{" + `${userProfile.id}` + ":" + `${userProfile.name}`, (err) => {
        if (err) throw err;
        console.log('Data has been added!');
    });
},
    { saidThanks: true }
),
  

bot.onTextMessage(/./, (message, response) => {
    checkUrlAvailability(response, message.text,connection);
});

bot.getBotProfile().then(response => console.log(`Bot Named: ${response.name}`));


// Server
if (currentYear <= 2025) {

if (process.env.NOW_URL || process.env.HEROKU_URL) {
    const http = require('http');
    const port = process.env.PORT || 5000;
    http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
    return ngrok.getPublicUrl().then(publicUrl => {
        const http = require('http');
        const port = process.env.PORT || 5000;
        console.log('publicUrl => ', publicUrl);
        http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(publicUrl));

    }).catch(error => {
        console.log('Can not connect to ngrok server. Is it running?');
        console.error(error);
        process.exit(1);
    });
}

}

