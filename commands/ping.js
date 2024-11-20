import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'

export class PingCommand extends Command {
  constructor() {
    super()
    this.data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')
  }

  execute(interaction) {
    interaction.reply('Pong!')
  }
}
