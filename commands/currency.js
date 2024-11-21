import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkBankManagerPermissions } from './utilities/permissions.js'
import { BANK_MANAGER_CHECK, BANK_MANAGER_ROLE_CHECK, SETUP_CHECK } from '../responses.js'
import { findGuild } from '../db/repository/guild.js'
import { addCurrencyInBank, findBank } from '../db/repository/bank.js'
import { addCurrencyToUser, calculateSumValue, findUserBank } from '../db/repository/user-bank.js'
import { createUser, findUser } from '../db/repository/user.js'

export class CurrencyCommand extends Command {
  constructor(sequelize) {
    super()
    this.sequelize = sequelize
    this.giveCommand = 'give'
    this.walletCommand = 'wallet'
    this.vaultCommand = 'vault'
    this.circulationCommand = 'circulation'
    this.addCommand = 'add'
    this.removeCommand = 'remove'
    this.bankCommandGroup = 'bank'
    this.userCommandGroup = 'user'
    this.userOption = 'user'
    this.amountOption = 'amount'

    this.data = new SlashCommandBuilder()
      .setName('currency')
      .setDescription('Manages the currency')
      .addSubcommand((subcommand) => {
        return subcommand
          .setName(this.giveCommand)
          .setDescription('Transfer currency to another user')
          .addUserOption((option) => {
            return option
              .setName(this.userOption)
              .setDescription('The user to transfer the currency to')
              .setRequired(true)
          })
          .addNumberOption((option) => {
            return option
              .setName(this.amountOption)
              .setDescription('The amount of currency to transfer')
              .setRequired(true)
          })
      })
      .addSubcommand((subcommand) => {
        return subcommand.setName(this.walletCommand).setDescription('Shows your current wallet')
      })
      .addSubcommandGroup((subcommandGroup) => {
        return subcommandGroup
          .setName(this.bankCommandGroup)
          .setDescription("Manages bank's currency")
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.addCommand)
              .setDescription('Add currency to the bank vault')
              .addNumberOption((option) => {
                return option
                  .setName(this.amountOption)
                  .setDescription('The amount of currency to add')
                  .setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.removeCommand)
              .setDescription('Remove currency from the bank vault')
              .addNumberOption((option) => {
                return option
                  .setName(this.amountOption)
                  .setDescription('The amount of currency to remove')
                  .setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.vaultCommand)
              .setDescription('Shows the amount of currency in the bank vault')
          })
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.circulationCommand)
              .setDescription('Shows the amount of currency in circulation')
          })
      })
      .addSubcommandGroup((subcommandGroup) => {
        return subcommandGroup
          .setName(this.userCommandGroup)
          .setDescription("Manages bank's currency")
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.addCommand)
              .setDescription('Add currency directly to a user from the bank')
              .addUserOption((option) => {
                return option
                  .setName(this.userOption)
                  .setDescription('The user to add the currency to')
                  .setRequired(true)
              })
              .addNumberOption((option) => {
                return option
                  .setName(this.amountOption)
                  .setDescription('The amount of currency to add')
                  .setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.removeCommand)
              .setDescription('Remove currency directly from a user to the bank')
              .addUserOption((option) => {
                return option
                  .setName(this.userOption)
                  .setDescription('The user to add the currency to')
                  .setRequired(true)
              })
              .addNumberOption((option) => {
                return option
                  .setName(this.amountOption)
                  .setDescription('The amount of currency to remove')
                  .setRequired(true)
              })
          })
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    const guild = await findGuild(interaction.guildId)
    const bank = await findBank(guild.id)

    if (!guild) {
      interaction.reply(SETUP_CHECK)
      return
    }

    if (!bank.bankManagerRoleId) {
      interaction.reply(BANK_MANAGER_ROLE_CHECK)
      return
    }

    if (
      !(await checkBankManagerPermissions(interaction.member, bank.bankManagerRoleId)) &&
      interaction.options.getSubcommand() !== this.giveCommand &&
      interaction.options.getSubcommand() !== this.walletCommand
    ) {
      interaction.reply(BANK_MANAGER_CHECK)
      return
    }

    if (interaction.options.getSubcommandGroup() === this.bankCommandGroup) {
      if (interaction.options.getSubcommand() === this.addCommand) {
        const amount = interaction.options.getNumber(this.amountOption)

        await addCurrencyInBank(amount, guild.id)

        interaction.reply(`${amount} ${bank.currencyName} added to the bank vault successfully`)
        return
      }
      if (interaction.options.getSubcommand() === this.removeCommand) {
        const amount = interaction.options.getNumber(this.amountOption)

        if (bank.currencyValue < amount) {
          interaction.reply(
            `Bank doesn't have enough currency to remove ${amount} ${bank.currencyName}. It only has ${bank.currencyValue} ${bank.currencyName}.`
          )
          return
        }

        await addCurrencyInBank(-amount, guild.id)

        interaction.reply(`${amount} ${bank.currencyName} removed from the bank vault successfully`)
        return
      }
      if (interaction.options.getSubcommand() === this.vaultCommand) {
        interaction.reply(`The bank has ${bank.currencyValue} ${bank.currencyName} in the vault`)
        return
      }
      if (interaction.options.getSubcommand() === this.circulationCommand) {
        const totalCurrency = (await calculateSumValue(bank.id)) + parseFloat(bank.currencyValue)
        let addendum = ''
        if (bank.currencyValue < 0) {
          addendum = `Tha bank has a debt of ${-bank.currencyValue} ${bank.currencyName}.`
        }

        interaction.reply(`A total of ${totalCurrency} ${bank.currencyName} is in circulation. ${addendum}`)
        return
      }
    }
    if (interaction.options.getSubcommandGroup() === this.userCommandGroup) {
      if (interaction.options.getSubcommand() === this.addCommand) {
        const amount = interaction.options.getNumber(this.amountOption)
        const targetUser = interaction.options.getUser(this.userOption)

        if (bank.currencyValue < amount) {
          interaction.reply(
            `Bank doesn't have enough currency to give ${amount} ${bank.currencyName}. It only has ${bank.currencyValue} ${bank.currencyName}.`
          )
          return
        }

        await this.sequelize.transaction(async (transaction) => {
          let user = await findUser(targetUser.id, transaction)

          if (!user) {
            user = await createUser(targetUser.id, bank, transaction)
          }
          await addCurrencyInBank(-amount, guild.id, transaction)

          await addCurrencyToUser(amount, user.id, bank.id, transaction)
        })

        interaction.reply(`${amount} ${bank.currencyName} added to the user ${targetUser} successfully`)
        return
      }
      if (interaction.options.getSubcommand() === this.removeCommand) {
        const amount = interaction.options.getNumber(this.amountOption)
        const targetUser = interaction.options.getUser(this.userOption)

        await this.sequelize.transaction(async (transaction) => {
          let user = await findUser(targetUser.id, transaction)

          if (!user) {
            user = await createUser(targetUser.id, bank, transaction)
          }

          const userBank = await findUserBank(user.id, bank.id, transaction)

          if (userBank.currencyValue < amount) {
            interaction.reply(
              `${targetUser} doesn't have enough currency to give ${amount} ${bank.currencyName}. It only has ${userBank.currencyValue} ${bank.currencyName}.`
            )
            return
          }
          await addCurrencyInBank(amount, guild.id, transaction)

          await addCurrencyToUser(-amount, user.id, bank.id, transaction)
        })

        interaction.reply(`${amount} ${bank.currencyName} removed from the user ${targetUser} successfully`)
        return
      }
    }
    if (interaction.options.getSubcommand() === this.giveCommand) {
      const amount = interaction.options.getNumber(this.amountOption)
      const targetUser = interaction.options.getUser(this.userOption)
      const sourceUser = interaction.member

      await this.sequelize.transaction(async (transaction) => {
        let targetDBUser = await findUser(targetUser.id, transaction)

        if (!targetDBUser) {
          targetDBUser = await createUser(targetUser.id, bank, transaction)
        }

        let sourceDBUser = await findUser(sourceUser.id, transaction)

        if (!sourceDBUser) {
          sourceDBUser = await createUser(sourceUser.id, bank, transaction)
        }

        await addCurrencyToUser(amount, targetDBUser.id, bank.id, transaction)
        await addCurrencyToUser(-amount, sourceDBUser.id, bank.id, transaction)
      })

      interaction.reply(`${amount} ${bank.currencyName} Currency transferred to ${targetUser} successfully`)
      return
    }
    if (interaction.options.getSubcommand() === this.walletCommand) {
      let user = await findUser(interaction.member.id)
      const userBank = await findUserBank(user.id, bank.id)

      interaction.reply(`You currently have ${userBank.currencyValue} ${bank.currencyName} in your wallet.`)

      return
    }
    interaction.reply('Invalid subcommand')
  }
}
