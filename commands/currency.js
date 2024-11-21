import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkBankManagerPermissions } from './utilities/permissions.js'
import { BANK_MANAGER_CHECK, SETUP_CHECK } from '../responses.js'
import { findGuild } from '../db/repository/guild.js'
import { findBank, updateCurrencyName } from '../db/repository/bank.js'

export class CurrencyCommand extends Command {
  constructor() {
    super()
    this.setCommand = 'set'
    this.showCommand = 'show'
    this.currencyOption = 'currency'

    this.data = new SlashCommandBuilder()
      .setName('currency')
      .setDescription('Manages the currency')
      .addSubcommand((subcommand) => {
        return subcommand
          .setName(this.setCommand)
          .setDescription('Sets the currency')
          .addStringOption((option) => {
            return option.setName(this.currencyOption).setDescription('The currency to set').setRequired(true)
          })
      })
      .addSubcommand((subcommand) => {
        return subcommand.setName(this.showCommand).setDescription('Shows the current currency')
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    const guild = await findGuild(interaction.guildId)

    if (!(await checkBankManagerPermissions(interaction.member, guild.id))) {
      interaction.reply(BANK_MANAGER_CHECK)
      return
    }

    if (!guild) {
      interaction.reply(SETUP_CHECK)
      return
    }

    if (interaction.options.getSubcommand() === this.setCommand) {
      const currency = interaction.options.getString(this.currencyOption)

      await updateCurrencyName(currency, guild.id)

      interaction.reply(`Currency set to ${currency}`)
      return
    }
    if (interaction.options.getSubcommand() === this.showCommand) {
      const bank = await findBank(guild.id)
      if (!bank.currencyName) {
        interaction.reply(`Currency is not set`)
        return
      }

      interaction.reply(`Currency is ${bank.currencyName}`)
      return
    }
    interaction.reply('Invalid subcommand')
  }
}
