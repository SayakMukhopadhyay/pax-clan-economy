import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

export class AddCurrencyBankCommand extends Command {
  constructor() {
    super()
    this.amountOption = 'amount'

    this.data = new SlashCommandBuilder()
      .setName('add-currency-bank')
      .setDescription('Add currency to the bank vault')
      .addNumberOption((option) => {
        return option.setName(this.amountOption).setDescription('The amount of currency to add').setRequired(true)
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  execute(interaction) {
    const amount = interaction.options.getNumber(this.amountOption)
    // Todo: Add the currency to the bank
    interaction.reply(`${amount} Currency added to the bank vault successfully`)
  }
}
