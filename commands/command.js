export class Command {
  /**
   * @param {import('discord.js').Interaction} interaction
   */
  execute(interaction) {
    console.log(`Default interaction ${interaction}`)
  }
}
