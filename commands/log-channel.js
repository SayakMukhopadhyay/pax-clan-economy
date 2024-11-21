import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkManageGuildPermissions } from './utilities/permissions.js'
import { deleteLogChannel, findGuild, updateLogChannel } from '../db/repository/guild.js'
import { ADMIN_CHECK, SETUP_CHECK } from '../responses.js'

export class LogChannelCommand extends Command {
  constructor() {
    super()
    this.enableCommand = 'enable'
    this.disableCommand = 'disable'
    this.showCommand = 'show'
    this.channelOption = 'channel'

    this.data = new SlashCommandBuilder()
      .setName('log-channel')
      .setDescription('Manages the channel to log transactions to')
      .addSubcommand((subcommand) => {
        return subcommand
          .setName(this.enableCommand)
          .setDescription('Enables transaction logging')
          .addChannelOption((option) => {
            return option
              .setName(this.channelOption)
              .setDescription('The channel to log all transactions to')
              .setRequired(true)
          })
      })
      .addSubcommand((subcommand) => {
        return subcommand.setName(this.disableCommand).setDescription('Disables transaction logging')
      })
      .addSubcommand((subcommand) => {
        return subcommand.setName(this.showCommand).setDescription('Shows the current log channel')
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

    if (interaction.options.getSubcommand() === this.enableCommand) {
      const channel = interaction.options.getChannel(this.channelOption)

      await updateLogChannel(channel.id, interaction.guildId)

      interaction.reply(`Logging enabled in channel ${channel}`)
      return
    }
    if (interaction.options.getSubcommand() === this.disableCommand) {
      await deleteLogChannel(interaction.guildId)

      interaction.reply(`Logging disabled`)
      return
    }
    if (interaction.options.getSubcommand() === this.showCommand) {
      if (!guild.logChannelId) {
        interaction.reply(`Logging is disabled`)
        return
      }

      const channel = interaction.guild.channels.cache.get(guild.logChannelId)

      if (!channel) {
        interaction.reply(
          `Logging is enabled in channel with id ${guild.logChannelId} but the channel doesn't seem to exist.`
        )
        return
      }

      interaction.reply(`Logging is enabled in ${channel}`)
      return
    }
    interaction.reply('Invalid subcommand')
  }
}
