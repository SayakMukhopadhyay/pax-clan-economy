import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { Guild } from '../db/models/guild.js'
import { Bank } from '../db/models/bank.js'

export class CurrencyCommand extends Command {
  constructor() {
    super()
    this.currencyOption = 'currency'

    this.data = new SlashCommandBuilder()
      .setName('currency')
      .setDescription('Sets the currency')
      .addStringOption((option) => {
        return option.setName(this.currencyOption).setDescription('The currency to set').setRequired(true)
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    const currency = interaction.options.getString(this.currencyOption)

    const guildId = await this.getGuildID(interaction.guildId)
    await this.updateCurrencyName(currency, guildId.id)

    interaction.reply(`Currency set to ${currency}`)
  }

  getGuildID(guildId) {
    return Guild.findOne({
      attributes: ['id'],
      where: {
        discordId: guildId
      }
    })
  }

  updateCurrencyName(currencyName, guildId) {
    return Bank.update(
      {
        currencyName: currencyName
      },
      {
        where: {
          guildId: guildId
        }
      }
    )
  }
}
