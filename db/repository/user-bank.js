import { UserBank } from '../models/user-bank.js'

export function findUserBank(userId, bankId, transaction) {
  return UserBank.findOne({
    where: {
      userId: userId,
      bankId: bankId
    },
    transaction: transaction
  })
}

export function addCurrencyToUser(amount, userId, bankId, transaction) {
  return UserBank.increment(
    {
      currencyValue: amount
    },
    {
      where: {
        userId: userId,
        bankId: bankId
      },
      transaction: transaction
    }
  )
}

export function updateUserThankTime(userId, bankId, transaction) {
  return UserBank.update(
    {
      lastThankedAt: new Date()
    },
    {
      where: {
        userId: userId,
        bankId: bankId
      },
      transaction: transaction
    }
  )
}
