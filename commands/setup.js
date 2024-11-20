import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { Guild } from '../db/models/guild.js'
import { Bank } from '../db/models/bank.js'

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
    const guildId = interaction.guildId

    if ((await this.findGuild(guildId)) !== null) {
      interaction.reply(`The bot is already setup`)
    } else {
      const guild = await this.createGuild(guildId)
      interaction.reply(`The bot is setup with id ${guild.id}`)
    }
  }

  findGuild(guildId) {
    return Guild.findOne({
      where: {
        discordId: guildId
      }
    })
  }

  async createGuild(guildId) {
    const guild = await Guild.create({
      discordId: guildId
    })
    await guild.createBank({})
    return guild
  }
}
