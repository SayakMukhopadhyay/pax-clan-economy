import { ClientReady } from '../client-ready.js'
import { InteractionCreate } from '../interaction-create.js'

export class EventArray {
  constructor() {
    this.events = []
    this.createEventArray()
  }

  createEventArray() {
    this.clientReady = new ClientReady()
    this.interactionCreate = new InteractionCreate()

    this.events.push(this.clientReady)
    this.events.push(this.interactionCreate)
  }
}
