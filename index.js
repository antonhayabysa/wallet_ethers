import { ethers } from 'ethers'
import { Bot } from 'grammy'

// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на токен вашего бота
const bot = new Bot('7230110914:AAESDlirwRS4giORtdpeYUk0p0NixdVGZwA')

// Список отслеживаемых кошельков и их текущие балансы
let trackedWallets = {}

// Интервал проверки в миллисекундах (например, каждые 1 сек.)
const CHECK_INTERVAL = 1000

// Функция для проверки балансов кошельков
async function checkBalances() {
  const provider = ethers.getDefaultProvider('mainnet')
  for (const [address, oldBalance] of Object.entries(trackedWallets)) {
    const newBalance = await provider.getBalance(address)
    const formattedNewBalance = ethers.utils.formatEther(newBalance)

    if (formattedNewBalance !== oldBalance) {
      bot.api.sendMessage(
        'YOUR_CHAT_ID', // Замените на ваш Telegram chat ID
        `Баланс кошелька ${address} изменился: ${formattedNewBalance} ETH`
      )
      // Обновляем баланс в отслеживаемых кошельках
      trackedWallets[address] = formattedNewBalance
    }
  }
}

// Запускаем периодическую проверку балансов
setInterval(checkBalances, CHECK_INTERVAL)

// Обработка команды /start
bot.command('start', ctx => {
  ctx.reply(
    'Добро пожаловать! Используйте команду /addwallet <адрес> для отслеживания нового кошелька.'
  )
})

// Обработка команды /addwallet
bot.command('addwallet', async ctx => {
  const address = ctx.message.text.split(' ')[1]
  if (!address) {
    return ctx.reply('Пожалуйста, укажите адрес кошелька.')
  }

  const provider = ethers.getDefaultProvider('mainnet')
  const balance = await provider.getBalance(address)
  const formattedBalance = ethers.utils.formatEther(balance)

  // Добавляем кошелек в список отслеживаемых
  trackedWallets[address] = formattedBalance
  ctx.reply(
    `Кошелек ${address} добавлен для отслеживания. Текущий баланс: ${formattedBalance} ETH`
  )
})

// Запуск бота
bot.start()
