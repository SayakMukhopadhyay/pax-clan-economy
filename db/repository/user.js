import { User } from '../models/user.js'

export function findUser(userId, transaction) {
  return User.findOne({
    where: {
      discordId: userId
    },
    transaction: transaction
  })
}

export async function createUser(userId, bank, transaction) {
  const user = await User.create(
    {
      discordId: userId
    },
    {
      transaction: transaction
    }
  )
  await user.addBank(bank, { through: { currencyValue: 0 }, transaction: transaction })
  return user
}
