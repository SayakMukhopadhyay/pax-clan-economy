import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkBotSetup, checkManageGuildPermissions } from './utilities/permissions.js'
import { deleteLogChannel, updateLogChannel } from '../db/repository/guild.js'
import { ADMIN_CHECK, SETUP_CHECK } from '../responses.js'

export class LogChannelCommand extends Command {
  constructor() {
    super()
    this.enableCommand = 'enable'
    this.disableCommand = 'disable'
    this.channelOption = 'channel'

    this.data = new SlashCommandBuilder()
      .setName('log-channel')
      .setDescription('Sets the channel to log transactions to')
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
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    if (!checkManageGuildPermissions(interaction.member)) {
      interaction.reply(ADMIN_CHECK)
      return
    }

    if (!(await checkBotSetup(interaction.guildId))) {
      interaction.reply(SETUP_CHECK)
      return
    }

    if (interaction.options.getSubcommand() === this.enableCommand) {
      const channel = interaction.options.getChannel(this.channelOption)

      await updateLogChannel(channel.id, interaction.guildId)

      interaction.reply(`Logging enabled in channel ${channel}`)
    } else if (interaction.options.getSubcommand() === this.disableCommand) {
      await deleteLogChannel(interaction.guildId)

      interaction.reply(`Logging disabled`)
    } else {
      interaction.reply('Invalid subcommand')
    }
  }
}
