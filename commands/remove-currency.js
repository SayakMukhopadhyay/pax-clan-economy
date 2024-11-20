import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

export class RemoveCurrencyCommand extends Command {
  constructor() {
    super()
    this.userOption = 'user'
    this.amountOption = 'amount'

    this.data = new SlashCommandBuilder()
      .setName('remove-currency')
      .setDescription('Remove currency directly from a user to the bank')
      .addUserOption((option) => {
        return option.setName(this.userOption).setDescription('The user to add the currency to').setRequired(true)
      })
      .addNumberOption((option) => {
        return option.setName(this.amountOption).setDescription('The amount of currency to remove').setRequired(true)
      })
  }

  execute(interaction) {
    const user = interaction.options.getUser(this.userOption)
    const amount = interaction.options.getNumber(this.amountOption)
    // Todo: Check if the currency is available with the user and transfer it to the bank
    interaction.reply(`${amount} Currency removed from ${user} successfully`)
  }
}
