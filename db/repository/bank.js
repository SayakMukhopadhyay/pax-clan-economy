import { Bank } from '../models/bank.js'

export function findBank(guildId) {
  return Bank.findOne({
    where: {
      guildId: guildId
    }
  })
}

export function updateBankManagerRole(roleId, guildId) {
  return Bank.update(
    {
      bankManagerRoleId: roleId
    },
    {
      where: {
        guildId: guildId
      }
    }
  )
}

export function updateCurrencyName(currencyName, guildId) {
  return Bank.update(
    {
      currencyName: currencyName
    },
    {
      where: {
        guildId: guildId
      }
    }
  )
}

export function addCurrencyInBank(amount, guildId, transaction) {
  return Bank.increment(
    {
      currencyValue: amount
    },
    {
      where: {
        guildId: guildId
      },
      transaction: transaction
    }
  )
}
