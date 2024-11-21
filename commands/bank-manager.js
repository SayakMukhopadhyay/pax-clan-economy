import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkManageGuildPermissions } from './utilities/permissions.js'
import { findGuild } from '../db/repository/guild.js'
import { ADMIN_CHECK, SETUP_CHECK } from '../responses.js'
import { updateBankManagerRole } from '../db/repository/bank.js'

export class BankManagerCommand extends Command {
  constructor() {
    super()
    this.roleOption = 'role'

    this.data = new SlashCommandBuilder()
      .setName('bank-manager')
      .setDescription('Sets the role that can manage the bank')
      .addRoleOption((option) => {
        return option.setName(this.roleOption).setDescription('The role that has access to the bank').setRequired(true)
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    if (!checkManageGuildPermissions(interaction.member)) {
      interaction.reply(ADMIN_CHECK)
      return
    }
    const role = interaction.options.getRole(this.roleOption)

    const guild = await findGuild(interaction.guildId)

    if (guild === null) {
      interaction.reply(SETUP_CHECK)
      return
    }

    await updateBankManagerRole(role.id, guild.id)

    interaction.reply(`Bank enabled for role ${role}`)
  }
}
