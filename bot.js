const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '7268996065:AAGRiMGVircHQXC_B2gCZfzjNIFxQg0YRdw';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });


const regex = /^\/start$/;

bot.on('message', (msg) => {
    let tarifShode = false;
    const chatId = msg.chat.id;

    const userText = msg.text;

    if (userText == '/start') {
        tarifShode = true;
        bot.sendMessage(chatId, "به ربات تلگرامی من خوش آمدید");
    }

    if (userText == "salam") {
        tarifShode = true;
        bot.sendMessage(chatId, "سلام خوش آمدید");
    }

    if (!tarifShode) {
        bot.sendMessage(chatId, "دستور ارسال شده تعریف نشده");
    }




    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, 'Received your message');
});


console.log("bot is started");