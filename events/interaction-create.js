import { Events } from 'discord.js'
import { Event } from './event.js'

export class InteractionCreate extends Event {
  constructor() {
    super()
    this.name = Events.InteractionCreate
  }

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return
    console.log(interaction)

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}
