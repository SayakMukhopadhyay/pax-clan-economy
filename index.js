import { config as dotenv } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
import { CommandCollection } from './commands/utilities/command-collection.js'
import { EventArray } from './events/utilities/event-array.js'
import { Register } from './register.js'
import { DB } from './db/db.js'

dotenv()

// Setup the DB
const db = new DB()

await db.authenticate()
db.loadModels()

if (process.env.NODE_ENV !== 'production') {
  await db.sync()
}

//Setup Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

const commands = new CommandCollection(db.sequelize)
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
  const register = new Register(client.commands)

  await register.deployCommands(false)
}
