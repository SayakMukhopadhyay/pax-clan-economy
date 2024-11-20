import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

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
  execute(interaction) {
    const currency = interaction.options.getString(this.currencyOption)
    // Todo: write to DB
    interaction.reply(`Currency set to ${currency}`)
  }
}
