import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

export class GiveCurrencyCommand extends Command {
  constructor() {
    super()
    this.userOption = 'user'
    this.amountOption = 'amount'

    this.data = new SlashCommandBuilder()
      .setName('give-currency')
      .setDescription('Transfer currency to another user')
      .addUserOption((option) => {
        return option.setName(this.userOption).setDescription('The user to transfer the currency to').setRequired(true)
      })
      .addNumberOption((option) => {
        return option.setName(this.amountOption).setDescription('The amount of currency to transfer').setRequired(true)
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  execute(interaction) {
    const user = interaction.options.getUser(this.userOption)
    const amount = interaction.options.getNumber(this.amountOption)
    // Todo: Check if the currency is available with the current user and transfer it to the target user
    interaction.reply(`${amount} Currency transferred to ${user} successfully`)
  }
}
