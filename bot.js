
// replace the value below with the Telegram token you receive from @BotFather
const token = '7268996065:AAGRiMGVircHQXC_B2gCZfzjNIFxQg0YRdw';
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, { polling: true });
const { default: axios } = require('axios');

const welcomeMessage = `
به ربات قیمت لحظه ای نوبیتکس خوش آمدید 
برای دریافت قیمت لحظه ای ارز مورد نظر لطفا اسم آن را بنویسید.
مثال: btcirt
`;



async function fetchSymbolsFromAPI() {
    try {
        const response = await axios.get("https://api.nobitex.net/v2/orderbook/all");
        return response.data;
    } catch (error) {
        console.error('Error fetching symbols from API:', error);
        return null;
    }
}

async function processSymbols() {
    const symbolsData = await fetchSymbolsFromAPI();
    const IRTSYMBOLS = [];
    if (!symbolsData) {
        console.error('Unable to fetch symbols data from API. Exiting.');
        return;
    }

    const currentTimestamp = new Date().getTime(); // Unix timestamp in milliseconds
    const formattedDateTime = new Date(currentTimestamp).toISOString().slice(0, 19).replace('T', ' ');

    const symbols = Object.keys(symbolsData);

    for (const symbol of symbols) {
        if (symbol.endsWith("IRT")) {
            const { description, lastTradePrice } = symbolsData[symbol];
            IRTSYMBOLS.push(symbol)
        }
    }
    return IRTSYMBOLS;

}


// Listen for /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // Add custom buttons
    const options = {
        reply_markup: {
            keyboard: [
                [{ text: "لیست نماد ها 📃" }],
            ],
            resize_keyboard: true,
            one_time_keyboard: false
        }
    };

    await bot.sendMessage(chatId, welcomeMessage, options);
});

// Handle text messages
bot.on('text', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const regex = /irt$/i; // Case-insensitive check for 'irt' at the end

    if (text === "لیست نماد ها 📃") {
        const symbols = await processSymbols()
        let message = ``;
        for (const symbol of symbols) {
            message += ` ${symbol} 
`
        }



        await bot.sendMessage(chatId, message);
    } else if (regex.test(text)) {
        // Get the current timestamp (in seconds)
        const to = Math.floor(Date.now() / 1000);

        // Get yesterday's timestamp (in seconds)
        const from = to - 86400; // 86400 seconds in a day

        try {
            const response = await axios.get(`https://api.nobitex.ir/market/udf/history?symbol=${text}&resolution=D&from=${from}&to=${to}`);

            if (response.data["s"] === "ok") {
                const price = response.data["c"][0];
                const formatted = price.toLocaleString('en-US');
                const priceMessage = `قیمت ${text} در این لحظه : ${formatted} تومان `;
                await bot.sendMessage(chatId, priceMessage);
            } else {
                const wrongMessage = `
نماد مورد نظر پیدا نشد!`;
                await bot.sendMessage(chatId, wrongMessage);
            }
        } catch (error) {
            await bot.sendMessage(chatId, "خطا در دریافت اطلاعات. لطفا دوباره تلاش کنید.");
        }
    } else if (text !== '/start') {
        const wrongMessage = `
فرمت پیام صحیح نمیباشد`;
        await bot.sendMessage(chatId, wrongMessage);
    }
});
