import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { Guild } from '../db/models/guild.js'

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
    if (interaction.options.getSubcommand() === this.enableCommand) {
      const channel = interaction.options.getChannel(this.channelOption)

      await this.updateChannel(channel.id, interaction.guildId)

      interaction.reply(`Logging enabled in channel ${channel}`)
    } else if (interaction.options.getSubcommand() === this.disableCommand) {
      await this.deleteChannel(interaction.guildId)

      interaction.reply(`Logging disabled`)
    } else {
      interaction.reply('Invalid subcommand')
    }
  }

  updateChannel(channelId, guildId) {
    return Guild.update(
      {
        logChannelId: channelId
      },
      {
        where: {
          discordId: guildId
        }
      }
    )
  }

  deleteChannel(guildId) {
    return Guild.update(
      {
        logChannelId: null
      },
      {
        where: {
          discordId: guildId
        }
      }
    )
  }
}
