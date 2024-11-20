import { DataTypes, Model } from 'sequelize'

export class UserBank extends Model {}

export function UserBankInit(sequelize) {
  UserBank.init(
    {
      UserId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      BankId: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      currencyValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0
      }
    },
    { sequelize, modelName: 'UserBank' }
  )
}
