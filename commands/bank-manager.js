import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkManageGuildPermissions } from './utilities/permissions.js'
import { findGuild } from '../db/repository/guild.js'
import { ADMIN_CHECK, SETUP_CHECK } from '../responses.js'
import { findBank, updateBankManagerRole } from '../db/repository/bank.js'

export class BankManagerCommand extends Command {
  constructor() {
    super()
    this.setCommand = 'set'
    this.showCommand = 'show'
    this.roleOption = 'role'

    this.data = new SlashCommandBuilder()
      .setName('bank-manager')
      .setDescription('Manages the role that can manage the bank')
      .addSubcommand((subcommand) => {
        return subcommand
          .setName(this.setCommand)
          .setDescription('Sets the role that can manage the bank')
          .addRoleOption((option) => {
            return option
              .setName(this.roleOption)
              .setDescription('The role that has access to the bank')
              .setRequired(true)
          })
      })
      .addSubcommand((subcommand) => {
        return subcommand.setName(this.showCommand).setDescription('Shows the current bank manager role')
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

    const guild = await findGuild(interaction.guildId)

    if (!guild) {
      interaction.reply(SETUP_CHECK)
      return
    }

    if (interaction.options.getSubcommand() === this.setCommand) {
      const role = interaction.options.getRole(this.roleOption)

      await updateBankManagerRole(role.id, guild.id)

      interaction.reply(`Bank enabled for role ${role}`)
      return
    }
    if (interaction.options.getSubcommand() === this.showCommand) {
      const bank = await findBank(guild.id)
      if (!bank.bankManagerRoleId) {
        interaction.reply(`Bank manager role is not set`)
        return
      }
      const role = interaction.guild.roles.cache.get(bank.bankManagerRoleId)

      if (!role) {
        interaction.reply(
          `Bank manager role is set to a role with id ${bank.bankManagerRoleId} but the role doesn't seem to exist.`
        )
        return
      }

      interaction.reply(`Bank manager role is ${role}`)
      return
    }
    interaction.reply('Invalid subcommand')
  }
}
