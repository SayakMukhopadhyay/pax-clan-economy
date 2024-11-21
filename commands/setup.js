import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkManageGuildPermissions } from './utilities/permissions.js'
import { createGuild, findGuild } from '../db/repository/guild.js'
import { ADMIN_CHECK } from '../responses.js'

export class SetupCommand extends Command {
  constructor() {
    super()
    this.currencyOption = 'currency'

    this.data = new SlashCommandBuilder().setName('setup').setDescription('Sets ups the bot for your server')
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    if (!checkManageGuildPermissions(interaction.member)) {
      interaction.reply(ADMIN_CHECK)
      return
    }
    const guildId = interaction.guildId

    if (await findGuild(guildId)) {
      interaction.reply(`The bot is already setup`)
      return
    }
    const guild = await createGuild(guildId)
    interaction.reply(`The bot is setup with id ${guild.id}`)
  }
}
