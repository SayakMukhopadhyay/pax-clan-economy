import { REST, Routes } from 'discord.js'
import { CommandCollection } from './commands/utilities/command-collection.js'

export class Register {
  constructor() {
    this.commands = new CommandCollection()
  }

  async deployCommands(guild) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN)
    try {
      console.log(`Started refreshing ${this.commands.commands.size} application (/) commands.`)

      let commands = this.commands.commands.map((command) => {
        return command.data.toJSON()
      })

      let fullRoute

      if (guild) {
        fullRoute = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
      } else {
        fullRoute = Routes.applicationCommands(process.env.CLIENT_ID)
      }

      const data = await rest.put(fullRoute, { body: commands })

      console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      console.error(error)
    }
  }
}
