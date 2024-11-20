import { DataTypes, Model } from 'sequelize'

export class Guild extends Model {}

export function GuildInit(sequelize) {
  Guild.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      discordId: {
        type: DataTypes.STRING,
        unique: true
      },
      logChannelId: {
        type: DataTypes.STRING
      }
    },
    { sequelize, modelName: 'Guild' }
  )
}
