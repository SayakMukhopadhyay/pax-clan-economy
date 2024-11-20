import { Events } from 'discord.js'
import { Event } from './event.js'

export class ClientReady extends Event {
  constructor() {
    super()
    this.name = Events.ClientReady
    this.once = true
  }

  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`)
  }
}
