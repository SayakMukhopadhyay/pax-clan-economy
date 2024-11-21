import { DataTypes, Model } from 'sequelize'

export class UserBank extends Model {}

export function UserBankInit(sequelize) {
  UserBank.init(
    {
      userId: {
        type: DataTypes.UUID,
      },
      bankId: {
        type: DataTypes.UUID,
      },
      currencyValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0
      }
    },
    { sequelize, modelName: 'UserBank' }
  )
}