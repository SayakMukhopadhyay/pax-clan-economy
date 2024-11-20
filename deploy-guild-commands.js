import { config as dotenv } from 'dotenv'
import { Register } from './register.js'

dotenv()

const register = new Register()

register.deployCommands(true)
