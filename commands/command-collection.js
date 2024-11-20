import { Collection } from 'discord.js'
import { PingCommand } from './ping.js'
import { CurrencyCommand } from './currency.js'
import { LogChannelCommand } from './log-channel.js'
import { AddCurrencyCommand } from './add-currency.js'
import { RemoveCurrencyCommand } from './remove-currency.js'
import { AddCurrencyBankCommand } from './add-currency-bank.js'
import { RemoveCurrencyBankCommand } from './remove-currency-bank.js'
import { GiveCurrencyCommand } from './give-currency.js'
import { SetupCommand } from './setup.js'
import { BankManagerCommand } from './bank-manager.js'

export class CommandCollection {
  constructor() {
    this.commands = new Collection()
    this.createCommandCollection()
  }

  createCommandCollection() {
    this.ping = new PingCommand()
    this.setup = new SetupCommand()
    this.bankManager = new BankManagerCommand()
    this.currency = new CurrencyCommand()
    this.logChannel = new LogChannelCommand()
    this.addCurrency = new AddCurrencyCommand()
    this.removeCurrency = new RemoveCurrencyCommand()
    this.addCurrencyBank = new AddCurrencyBankCommand()
    this.removeCurrencyBank = new RemoveCurrencyBankCommand()
    this.giveCurrency = new GiveCurrencyCommand()

    this.commands.set(this.ping.data.name, this.ping)
    this.commands.set(this.setup.data.name, this.setup)
    this.commands.set(this.bankManager.data.name, this.bankManager)
    this.commands.set(this.currency.data.name, this.currency)
    this.commands.set(this.logChannel.data.name, this.logChannel)
    this.commands.set(this.addCurrency.data.name, this.addCurrency)
    this.commands.set(this.removeCurrency.data.name, this.removeCurrency)
    this.commands.set(this.addCurrencyBank.data.name, this.addCurrencyBank)
    this.commands.set(this.removeCurrencyBank.data.name, this.removeCurrencyBank)
    this.commands.set(this.giveCurrency.data.name, this.giveCurrency)
  }
}
