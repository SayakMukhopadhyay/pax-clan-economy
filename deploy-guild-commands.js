import { config as dotenv } from 'dotenv'
import { Register } from './register.js'
import { CommandCollection } from './commands/utilities/command-collection.js'

dotenv()

const register = new Register(new CommandCollection())

const perGuild = process.argv[2] === 'true'
const remove = process.argv[3] === 'true'

register.deployCommands(perGuild, remove)
