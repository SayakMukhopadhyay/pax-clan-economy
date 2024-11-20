import { config as dotenv } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
import { CommandCollection } from './commands/command-collection.js'
import { EventArray } from './events/event-array.js'

dotenv()

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

const commands = new CommandCollection()
client.commands = commands.commands

const events = new EventArray()

for (const event of events.events) {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

client.login(process.env.DISCORD_TOKEN)

if (process.env.NODE_ENV === 'production') {
  import('./register.js')
}
