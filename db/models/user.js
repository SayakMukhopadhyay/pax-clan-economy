import { DataTypes, Model } from 'sequelize'

export class User extends Model {}

export function UserInit(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      discordId: {
        type: DataTypes.STRING,
        unique: true
      }
    },
    { sequelize, modelName: 'User' }
  )
}
