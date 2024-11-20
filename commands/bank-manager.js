import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { Bank } from '../db/models/bank.js'
import { Guild } from '../db/models/guild.js'

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
    const role = interaction.options.getRole(this.roleOption)

    const guildId = await this.getGuildID(interaction.guildId)
    await this.updateRole(role.id, guildId.id)

    interaction.reply(`Bank enabled for role ${role}`)
  }

  getGuildID(guildId) {
    return Guild.findOne({
      attributes: ['id'],
      where: {
        discordId: guildId
      }
    })
  }

  updateRole(roleId, guildId) {
    return Bank.update(
      {
        bankManagerRoleId: roleId
      },
      {
        where: {
          guildId: guildId
        }
      }
    )
  }
}
