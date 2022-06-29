const nodemailer = require('nodemailer')
const QRCode = require('qrcode')
const dotenv = require('dotenv')
dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.migadu.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MIGADU_EMAIL,
      pass: process.env.MIGADU_PASSWORD,
    }
  }, {
    from: `"Giovanni Topescorts" <${process.env.MIGADU_EMAIL}>`,
  })

const sendEmail = async (string) => {
  
  const img = await QRCode.toDataURL(string)
  const buffer = Buffer.from(img.split("base64,")[1], "base64");

  await transporter.sendMail({
    to: process.env.MIGADU_RECEIVER,
    subject: 'New WA qrcode',
    text: 'New WA qrcode',
    attachments: [
      {
        filename: 'qrcode.png',
        content: buffer,
        encoding: 'base64'
      }
    ]
  }) 
}

module.exports.sendEmail = sendEmail