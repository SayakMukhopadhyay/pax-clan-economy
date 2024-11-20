import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

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
  execute(interaction) {
    if (interaction.options.getSubcommand() === this.enableCommand) {
      const channel = interaction.options.getChannel(this.channelOption)
      // Todo: Add the channel to the DB
      interaction.reply(`Logging enabled in channel ${channel}`)
    } else if (interaction.options.getSubcommand() === this.disableCommand) {
      // Todo: Remove the channel from the DB
      interaction.reply(`Logging disabled`)
    } else {
      interaction.reply('Invalid subcommand')
    }
  }
}
