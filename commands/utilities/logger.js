export function logCredit(channels, isBank, targetUser, sourceUser, amount, logChannelId, currencyName) {
  const channel = channels.get(logChannelId)
  if (!channel) {
    return
  }
  if (isBank) {
    targetUser = "the bank"
  }
  channel.send(`${amount} ${currencyName} was credited to ${targetUser} by ${sourceUser}`)
}

export function logDebit(channels, isBank, targetUser, sourceUser, amount, logChannelId, currencyName) {
  const channel = channels.get(logChannelId)
  if (!channel) {
    return
  }
  if (isBank) {
    targetUser = "the bank"
  }
  channel.send(`${amount} ${currencyName} was debited from ${targetUser} by ${sourceUser}`)
}
