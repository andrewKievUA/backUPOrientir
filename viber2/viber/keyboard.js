
const Keyboard = require('viber-bot').Message.Keyboard;

const keys = new Keyboard({
  "Type": "keyboard",
  "Buttons": [ 

    {
      "Columns": 3,
      "Rows":1,
      "Text": "<br><font color=\"#ffffff\"><b>Цех</b></font>",
      "TextSize": "small",
      "TextHAlign": "center",
      "TextVAlign": "middle",
      "ActionType": "reply",
      "ActionBody": "1",  
      "BgColor": "#494E67",
    },

    {
      "Columns": 3,
      "Rows": 1,
      "Text": "<br><font color=\"#ffffff\"><b>Помол</b></font>",
      "TextSize": "small",
      "TextHAlign": "center",
      "TextVAlign": "middle",
      "ActionType": "reply",
      "ActionBody": "3",  
      "BgColor": "#494E67",
    },



]
});

module.exports = keys;
