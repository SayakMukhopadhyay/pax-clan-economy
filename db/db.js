import { Sequelize } from 'sequelize'
import { Guild, GuildInit } from './models/guild.js'
import { Bank, BankInit } from './models/bank.js'
import { User, UserInit } from './models/user.js'
import { UserBank, UserBankInit } from './models/user-bank.js'

export class DB {
  constructor() {
    this.sequelize = new Sequelize(process.env.DB_DB, process.env.DB_USER, process.env.DB_PASS, {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    })
  }

  async authenticate() {
    try {
      await this.sequelize.authenticate()
      console.log('Database connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }

  loadModels() {
    GuildInit(this.sequelize)
    BankInit(this.sequelize)
    UserInit(this.sequelize)
    UserBankInit(this.sequelize)

    Guild.hasOne(Bank, { foreignKey: { name: 'guildId', allowNull: false }, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    Bank.belongsTo(Guild)

    User.belongsToMany(Bank, { through: UserBank, foreignKey: 'userId' })
    Bank.belongsToMany(User, { through: UserBank, foreignKey: 'bankId' })
  }

  async sync() {
    await this.sequelize.sync({ alter: true })
  }
}
