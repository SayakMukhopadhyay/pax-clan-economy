import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkBankManagerPermissions } from './utilities/permissions.js'
import { BANK_MANAGER_CHECK, SETUP_CHECK } from '../responses.js'
import { findGuild } from '../db/repository/guild.js'
import { updateCurrencyName } from '../db/repository/bank.js'

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
    if (!(await checkBankManagerPermissions(interaction.member))) {
      interaction.reply(BANK_MANAGER_CHECK)
      return
    }
    const currency = interaction.options.getString(this.currencyOption)

    const guild = await findGuild(interaction.guildId)

    if (guild === null) {
      interaction.reply(SETUP_CHECK)
      return
    }

    await updateCurrencyName(currency, guild.id)

    interaction.reply(`Currency set to ${currency}`)
  }
}
