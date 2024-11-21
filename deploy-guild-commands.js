import { config as dotenv } from 'dotenv'
import { Register } from './register.js'
import { CommandCollection } from './commands/utilities/command-collection.js'

dotenv()

const register = new Register(new CommandCollection())

register.deployCommands(true)
