import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

export class AddCurrencyCommand extends Command {
  constructor() {
    super()
    this.userOption = 'user'
    this.amountOption = 'amount'

    this.data = new SlashCommandBuilder()
      .setName('add-currency')
      .setDescription('Add currency directly to a user from the bank')
      .addUserOption((option) => {
        return option.setName(this.userOption).setDescription('The user to add the currency to').setRequired(true)
      })
      .addNumberOption((option) => {
        return option.setName(this.amountOption).setDescription('The amount of currency to add').setRequired(true)
      })
  }

  execute(interaction) {
    const user = interaction.options.getUser(this.userOption)
    const amount = interaction.options.getNumber(this.amountOption)
    // Todo: Check if the currency is available in the bank and transfer it to the user
    interaction.reply(`${amount} Currency added to ${user} successfully`)
  }
}
