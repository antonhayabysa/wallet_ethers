// Импортируем необходимые модули и конфигурируем переменные окружения
import { config } from 'dotenv'
config()

import { createServer } from 'http'
import { ethers } from 'ethers'
import { Bot } from 'grammy'

// Устанавливаем порт для сервера. Если переменная окружения PORT не установлена, используем 3000
const PORT = process.env.PORT || 3000

// Создаем экземпляр бота Telegram с использованием токена, хранящегося в переменных окружения
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN)

// Обрабатываем команду /start
bot.command('start', ctx => {
  ctx.reply(
    'Добро пожаловать! Используйте команду /addwallet <адрес> для отслеживания нового кошелька.'
  )
  console.log('Received /start command') // Логируем получение команды /start
})

// Обрабатываем команду /addwallet
bot.command('addwallet', async ctx => {
  const address = ctx.message.text.split(' ')[1] // Извлекаем адрес кошелька из сообщения
  if (!address) {
    return ctx.reply('Пожалуйста, укажите адрес кошелька.') // Если адрес не указан, просим указать его
  }

  const provider = ethers.getDefaultProvider('mainnet') // Подключаемся к основной сети Ethereum
  const balance = await provider.getBalance(address) // Получаем баланс указанного кошелька
  const formattedBalance = ethers.utils.formatEther(balance) // Форматируем баланс в ETH

  ctx.reply(
    `Кошелек ${address} добавлен для отслеживания. Текущий баланс: ${formattedBalance} ETH`
  )
  console.log('Received /addwallet command') // Логируем получение команды /addwallet
})

// Запускаем бота
bot.start()

// Создаем HTTP-сервер, который отвечает "Hello, world!" на все запросы
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello, world!\n')
})

// Запускаем сервер и выводим в консоль информацию о его запуске
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`TELEGRAM_BOT_TOKEN: ${process.env.TELEGRAM_BOT_TOKEN}`)
  console.log(`YOUR_CHAT_ID: ${process.env.YOUR_CHAT_ID}`)
})
