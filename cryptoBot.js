
// replace the value below with the Telegram token you receive from @BotFather
const token = '7268996065:AAGRiMGVircHQXC_B2gCZfzjNIFxQg0YRdw';
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });
const { default: axios } = require('axios');




bot.on("text", async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;
    let notControllerMessage = true;

    if (userMessage == "/start") {
        notControllerMessage = false;
        bot.sendMessage(chatId, 'به ربات قیمت لحظه ای نوبیتکس خوش آمدید', {
            reply_markup: {
                keyboard: [
                    [{ text: "لیست نماد ها 📃" }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
            }
        });
    }




    if (notControllerMessage) {
        bot.sendMessage(chatId, 'لطفا از دستورات موجود استفاده کنید');
    }



})