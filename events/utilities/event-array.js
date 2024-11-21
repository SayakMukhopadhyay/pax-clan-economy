import { ClientReady } from '../client-ready.js'
import { InteractionCreate } from '../interaction-create.js'
import { MessageCreate } from '../message-create.js'

export class EventArray {
  constructor(sequelize) {
    this.sequelize = sequelize
    this.events = []
    this.createEventArray()
  }

  createEventArray() {
    this.clientReady = new ClientReady()
    this.interactionCreate = new InteractionCreate()
    this.messageCreate = new MessageCreate(this.sequelize)

    this.events.push(this.clientReady)
    this.events.push(this.interactionCreate)
    this.events.push(this.messageCreate)
  }
}
