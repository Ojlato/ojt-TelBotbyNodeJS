
// replace the value below with the Telegram token you receive from @BotFather
const token = '7268996065:AAGRiMGVircHQXC_B2gCZfzjNIFxQg0YRdw';
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });
const { default: axios } = require('axios');


let symbolsMessage = "";


async function getSymbolsListMessage() {
    symbolsMessage = "";

    const response = await axios.get("https://api.nobitex.net/v2/orderbook/all");
    for (const symbol in response.data) {
        symbolsMessage += ` ${symbol}
`
    }

    console.log("symbols fetched")
    return symbolsMessage
}




// getSymbolsListMessage()


async function getPrice(symbol) {

    const to = Math.floor(Date.now() / 1000);

    const from = to - 86400

    const response = await axios.get(`https://api.nobitex.ir/market/udf/history?symbol=${symbol}&resolution=D&from=${from}&to=${to}`)
    console.log(response.data)
    if (response.data["s"] == "ok") {
        return response.data["c"]
    }
}

const checkingSymbolRegex = `/irt$/i`;
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

    if (userMessage == "لیست نماد ها 📃") {
        notControllerMessage = false;
        bot.sendMessage(chatId, symbolsMessage)
    }


    if (checkingSymbolRegex.test(userMessage)) {
        const price = await getPrice(userMessage)
        bot.sendMessage(chatId, `قیمت نماد مورد نظر ${price} تومان است`);
    }



    if (notControllerMessage) {
        bot.sendMessage(chatId, 'لطفا از دستورات موجود استفاده کنید');
    }



})