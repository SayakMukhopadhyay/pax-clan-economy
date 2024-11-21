import { Guild } from '../models/guild.js'

export function findGuild(guildId) {
  return Guild.findOne({
    where: {
      discordId: guildId
    }
  })
}

export async function createGuild(guildId) {
  const guild = await Guild.create({
    discordId: guildId
  })
  await guild.createBank({})
  return guild
}

export function updateLogChannel(channelId, guildId) {
  return Guild.update(
    {
      logChannelId: channelId
    },
    {
      where: {
        discordId: guildId
      }
    }
  )
}

export function deleteLogChannel(guildId) {
  return Guild.update(
    {
      logChannelId: null
    },
    {
      where: {
        discordId: guildId
      }
    }
  )
}
