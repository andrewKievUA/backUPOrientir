
function createMessageData(sender_name, text_received, sender_id) {
    var now = new Date();
    var days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    var day = days[now.getDay()];
    var time = now.toTimeString().slice(0, 5);
    var timeNow = day + ":" + time;

    let data = {
        name: sender_name,
        time: timeNow,
        text: text_received,
        date: days[now.getDay()],
        timeJs: new Date().toISOString().split('T')[0],
        viber_id: sender_id
    };

    return data;
}

// Export the function for use in other files
module.exports = createMessageData;