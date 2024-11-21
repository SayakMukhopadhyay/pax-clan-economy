import { SlashCommandBuilder } from 'discord.js'
import { Command } from './command.js'
import { checkBankManagerPermissions, checkManageGuildPermissions } from './utilities/permissions.js'
import { findGuild } from '../db/repository/guild.js'
import { ADMIN_CHECK, BANK_MANAGER_CHECK, SETUP_CHECK } from '../responses.js'
import {
  findBank,
  updateBankManagerRole,
  updateCurrencyName,
  updateThankCooldown,
  updateThankValue
} from '../db/repository/bank.js'

export class BankCommand extends Command {
  constructor() {
    super()
    this.setCommand = 'set'
    this.showCommand = 'show'
    this.setNameCommand = 'set-name'
    this.showNameCommand = 'show-name'
    this.setValueCommand = 'set-value'
    this.showValueCommand = 'show-value'
    this.setCooldownCommand = 'set-cooldown'
    this.showCooldownCommand = 'show-cooldown'
    this.managerCommandGroup = 'manager'
    this.currencyCommandGroup = 'currency'
    this.thankCommandGroup = 'thank'
    this.roleOption = 'role'
    this.currencyOption = 'currency'
    this.amountOption = 'amount'
    this.minutesOption = 'minutes'

    this.data = new SlashCommandBuilder()
      .setName('bank')
      .setDescription('Manages the bank')
      .addSubcommandGroup((subcommandGroup) => {
        return subcommandGroup
          .setName(this.managerCommandGroup)
          .setDescription('Manages the role that can manage the bank')
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.setCommand)
              .setDescription('Sets the role that can manage the bank')
              .addRoleOption((option) => {
                return option
                  .setName(this.roleOption)
                  .setDescription('The role that has access to the bank')
                  .setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand.setName(this.showCommand).setDescription('Shows the current bank manager role')
          })
      })
      .addSubcommandGroup((subcommandGroup) => {
        return subcommandGroup
          .setName(this.currencyCommandGroup)
          .setDescription('Manages the currency settings')
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.setNameCommand)
              .setDescription('Sets the currency')
              .addStringOption((option) => {
                return option.setName(this.currencyOption).setDescription('The currency to set').setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand.setName(this.showNameCommand).setDescription('Shows the current currency')
          })
      })
      .addSubcommandGroup((subcommandGroup) => {
        return subcommandGroup
          .setName(this.thankCommandGroup)
          .setDescription('Manages the thanks settings')
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.setValueCommand)
              .setDescription('Sets the amount to be received when thanked')
              .addNumberOption((option) => {
                return option.setName(this.amountOption).setDescription('The amount to be received').setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.showValueCommand)
              .setDescription('Shows the amount to be received when thanked')
          })
          .addSubcommand((subcommand) => {
            return subcommand
              .setName(this.setCooldownCommand)
              .setDescription('Sets the cooldown between receiving thanks in minutes')
              .addNumberOption((option) => {
                return option.setName(this.minutesOption).setDescription('The cooldown in minutes').setRequired(true)
              })
          })
          .addSubcommand((subcommand) => {
            return subcommand.setName(this.showCooldownCommand).setDescription('Shows the cooldown set in minutes')
          })
      })
  }

  /**
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    if (
      !checkManageGuildPermissions(interaction.member) &&
      interaction.options.getSubcommandGroup() === this.managerCommandGroup
    ) {
      interaction.reply(ADMIN_CHECK)
      return
    }

    const guild = await findGuild(interaction.guildId)
    const bank = await findBank(guild.id)

    if (!(await checkBankManagerPermissions(interaction.member, bank.bankManagerRoleId))) {
      interaction.reply(BANK_MANAGER_CHECK)
      return
    }

    if (!guild) {
      interaction.reply(SETUP_CHECK)
      return
    }

    if (interaction.options.getSubcommandGroup() === this.managerCommandGroup) {
      if (interaction.options.getSubcommand() === this.setCommand) {
        const role = interaction.options.getRole(this.roleOption)

        await updateBankManagerRole(role.id, guild.id)

        interaction.reply(`Bank enabled for role ${role}`)
        return
      }
      if (interaction.options.getSubcommand() === this.showCommand) {
        const bank = await findBank(guild.id)
        if (!bank.bankManagerRoleId) {
          interaction.reply(`Bank manager role is not set`)
          return
        }
        const role = interaction.guild.roles.cache.get(bank.bankManagerRoleId)

        if (!role) {
          interaction.reply(
            `Bank manager role is set to a role with id ${bank.bankManagerRoleId} but the role doesn't seem to exist.`
          )
          return
        }

        interaction.reply(`Bank manager role is ${role}`)
        return
      }
    }
    if (interaction.options.getSubcommandGroup() === this.currencyCommandGroup) {
      if (interaction.options.getSubcommand() === this.setNameCommand) {
        const currency = interaction.options.getString(this.currencyOption)

        await updateCurrencyName(currency, guild.id)

        interaction.reply(`Currency set to ${currency}`)
        return
      }
      if (interaction.options.getSubcommand() === this.showNameCommand) {
        interaction.reply(`Currency is ${bank.currencyName}`)
        return
      }
    }
    if (interaction.options.getSubcommandGroup() === this.thankCommandGroup) {
      if (interaction.options.getSubcommand() === this.setValueCommand) {
        const amount = interaction.options.getNumber(this.amountOption)

        await updateThankValue(amount, guild.id)

        interaction.reply(`Thank value updated to ${amount} ${bank.currencyName}`)
        return
      }
      if (interaction.options.getSubcommand() === this.showValueCommand) {
        interaction.reply(`${bank.thankValue} ${bank.currencyName} is received when thanked`)
        return
      }
      if (interaction.options.getSubcommand() === this.setCooldownCommand) {
        const time = interaction.options.getNumber(this.minutesOption)

        await updateThankCooldown(time, guild.id)

        interaction.reply(`Thank cooldown updated to ${time} minutes`)
        return
      }
      if (interaction.options.getSubcommand() === this.showCooldownCommand) {
        interaction.reply(`Thank cooldown is ${bank.thankCooldownMinutes} minutes`)
        return
      }
    }
    interaction.reply('Invalid subcommand')
  }
}
