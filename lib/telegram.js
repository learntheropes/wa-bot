const { Telegraf } = require('telegraf')
const QRCode = require('qrcode')
const dotenv = require('dotenv')
dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const sendTelegram = async (string) => {

  const img = await QRCode.toDataURL(string)
  const buffer = Buffer.from(img.split("base64,")[1], "base64")

  await bot.telegram.sendPhoto(process.env.TELEGRAM_CHAT_ID, {
    source: Buffer.from(buffer, 'base64')
  })
}

module.exports.sendTelegram = sendTelegram