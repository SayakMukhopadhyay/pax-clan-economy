import { REST, Routes } from 'discord.js'
import { DB } from './db/db.js'
import { Guild } from './db/models/guild.js'

export class Register {
  constructor(commands) {
    this.commands = commands

    this.db = new DB()
  }

  async deployCommands(perGuild, remove) {
    await this.db.authenticate()
    this.db.loadModels()

    const rest = new REST().setToken(process.env.DISCORD_TOKEN)
    try {
      console.log(`Started refreshing ${this.commands.commands.size} application (/) commands.`)

      let commands = this.commands.commands.map((command) => {
        return command.data.toJSON()
      })

      if (remove) {
        commands = []
      }

      let fullRoute

      if (perGuild) {
        const allGuilds = await Guild.findAll()

        for (const guild of allGuilds) {
          fullRoute = Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.discordId)

          const data = await rest.put(fullRoute, { body: commands })

          console.log(`Successfully reloaded ${data.length} application (/) commands for guild ${guild.id}.`)
        }
      } else {
        fullRoute = Routes.applicationCommands(process.env.CLIENT_ID)

        const data = await rest.put(fullRoute, { body: commands })

        console.log(`Successfully reloaded ${data.length} application (/) commands.`)
      }
    } catch (error) {
      console.error(error)
    }
  }
}
