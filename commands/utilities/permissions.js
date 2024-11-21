import { PermissionsBitField } from 'discord.js'
import { findGuild } from '../../db/repository/guild.js'
import { findBank } from '../../db/repository/bank.js'

export function checkManageGuildPermissions(member) {
  return member.permissions.has(PermissionsBitField.Flags.ManageGuild, true)
}

export async function checkBankManagerPermissions(member) {
  const bank = await findBank(member.guild.id)

  return member.roles.cache.some(role => role.id === bank.bankManagerRoleId)
}

export async function checkBotSetup(guildId) {
  return (await findGuild(guildId)) !== null
}