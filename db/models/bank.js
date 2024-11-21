import { DataTypes, Model } from 'sequelize'

export class Bank extends Model {}

export function BankInit(sequelize) {
  Bank.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      currencyName: {
        type: DataTypes.STRING,
        defaultValue: 'Irons'
      },
      currencyValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0
      },
      thankValue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1.0
      },
      thankCooldownMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 60
      },
      bankManagerRoleId: {
        type: DataTypes.STRING
      }
    },
    { sequelize, modelName: 'Bank' }
  )
}
