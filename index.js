import { config } from 'dotenv'
config()

import { createServer } from 'http'
import { ethers } from 'ethers'
import { Bot } from 'grammy'

const PORT = process.env.PORT || 3000

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)

bot.command('start', ctx => {
  ctx.reply(
    'Добро пожаловать! Используйте команду /addwallet <адрес> для отслеживания нового кошелька.'
  )
  console.log('Received /start command')
})

bot.command('addwallet', async ctx => {
  const address = ctx.message.text.split(' ')[1]
  if (!address) {
    return ctx.reply('Пожалуйста, укажите адрес кошелька.')
  }

  const provider = ethers.getDefaultProvider('mainnet')
  const balance = await provider.getBalance(address)
  const formattedBalance = ethers.utils.formatEther(balance)

  ctx.reply(
    `Кошелек ${address} добавлен для отслеживания. Текущий баланс: ${formattedBalance} ETH`
  )
  console.log('Received /addwallet command')
})

bot.start()

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello, world!\n')
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN}`)
  console.log(`YOUR_CHAT_ID: ${process.env.YOUR_CHAT_ID}`)
})
