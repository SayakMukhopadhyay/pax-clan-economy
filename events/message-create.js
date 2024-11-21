import { Events } from 'discord.js'
import { Event } from './event.js'
import { createUser, findUser } from '../db/repository/user.js'
import { addCurrencyInBank, findBank } from '../db/repository/bank.js'
import { addCurrencyToUser, findUserBank, updateUserThankTime } from '../db/repository/user-bank.js'
import { findGuild } from '../db/repository/guild.js'
import { DateTime } from 'luxon'

export class MessageCreate extends Event {
  constructor(sequelize) {
    super()
    this.sequelize = sequelize
    this.name = Events.MessageCreate
  }

  async execute(message) {
    const content = message.content

    if (content.toLowerCase().includes(`thank`)) {
      const mentionedUsers = message.mentions.users

      mentionedUsers.sweep((user) => {
        return user.id === message.author.id
      })

      if (mentionedUsers.size === 0) {
        return
      }
      const guild = await findGuild(message.guildId)
      const bank = await findBank(guild.id)

      const currencyAddedUser = []

      await this.sequelize.transaction(async (transaction) => {
        for (const [userId, targetUser] of mentionedUsers) {
          let user = await findUser(userId, transaction)
          let userBank = await findUserBank(user.id, bank.id, transaction)

          if (!user) {
            user = await createUser(targetUser.id, bank, transaction)
          }

          const lastThankedAt = DateTime.fromJSDate(userBank.lastThankedAt)
          const timeNow = DateTime.now()

          const diff = timeNow.diff(lastThankedAt, 'minutes').as('minutes')

          if (diff < bank.thankCooldownMinutes) {
            continue
          }

          const amount = bank.thankValue

          await addCurrencyInBank(-amount, guild.id, transaction)

          await addCurrencyToUser(amount, user.id, bank.id, transaction)

          await updateUserThankTime(user.id, bank.id, transaction)

          currencyAddedUser.push(targetUser)
        }
      })

      if (currencyAddedUser.length === 0) {
        return
      }

      message.reply(
        `Congratulations ${currencyAddedUser.join(', ')}! You have received ${bank.thankValue} ${bank.currencyName}.`
      )
    }
  }
}
