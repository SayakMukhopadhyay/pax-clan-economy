import { PermissionsBitField } from 'discord.js'
import { findGuild } from '../../db/repository/guild.js'

export function checkManageGuildPermissions(member) {
  return member.permissions.has(PermissionsBitField.Flags.ManageGuild, true)
}

export function checkBankManagerPermissions(member, bankManagerRoleId) {
  return member.roles.cache.some((role) => role.id === bankManagerRoleId)
}

export async function checkBotSetup(guildId) {
  return !(await findGuild(guildId))
}
