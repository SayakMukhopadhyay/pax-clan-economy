import { Collection } from 'discord.js'
import { PingCommand } from '../ping.js'
import { CurrencyCommand } from '../currency.js'
import { LogChannelCommand } from '../log-channel.js'
import { SetupCommand } from '../setup.js'
import { BankCommand } from '../bank.js'

export class CommandCollection {
  constructor(sequelize) {
    this.sequelize = sequelize
    this.commands = new Collection()
    this.createCommandCollection()
  }

  createCommandCollection() {
    this.ping = new PingCommand()
    this.setup = new SetupCommand()
    this.bank = new BankCommand()
    this.currency = new CurrencyCommand(this.sequelize)
    this.logChannel = new LogChannelCommand()

    this.commands.set(this.ping.data.name, this.ping)
    this.commands.set(this.setup.data.name, this.setup)
    this.commands.set(this.bank.data.name, this.bank)
    this.commands.set(this.currency.data.name, this.currency)
    this.commands.set(this.logChannel.data.name, this.logChannel)
  }
}
