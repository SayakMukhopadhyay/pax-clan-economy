import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

export class RemoveCurrencyBankCommand extends Command {
  constructor() {
    super()
    this.amountOption = 'amount'

    this.data = new SlashCommandBuilder()
      .setName('remove-currency-bank')
      .setDescription('Remove currency from the bank vault')
      .addNumberOption((option) => {
        return option.setName(this.amountOption).setDescription('The amount of currency to remove').setRequired(true)
      })
  }

  execute(interaction) {
    const amount = interaction.options.getNumber(this.amountOption)
    // Todo: Check if the currency is available with the bank and remove it
    interaction.reply(`${amount} Currency removed from the bank vault successfully`)
  }
}
