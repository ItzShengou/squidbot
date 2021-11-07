const { MessageEmbed } = require(`discord.js`);
const config = require(`../../config.json`);
const prefix = config.settings.prefix;
const Timeout = new Set();

module.exports = async (client , message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd) || client.commands.find((cmds) => cmds.aliases && cmds.aliases.includes(cmd));
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
      let permissions = message.channel.permissionsFor(message.member);
      if (!permissions || !permissions.has(command.permission)) return message.channel.send(`Недостаточно прав на использование команды!`);

      if ((command.owner == true) && !config.settings.owner.includes(message.author.id)) return;

      if (Timeout.has(`${message.author.id}${command.name}`)) {
        return message.channel.send(`У вас задержка на данную команду. Попробуйте позже`);
      } else {
        let time = (command.timeout || 2000);
        command.run(client, message, args).catch(err => {
          let errors = new MessageEmbed()
            .setTitle(`Ошибка Команды`)
            .setColor(config.color.error)
            .setDescription(err)
            .addField(`Введённая команда`,cmd)
            .setTimestamp()
          client.channels.cache.get(config.logs.cmd).send(errors);
        });
        Timeout.add(`${message.author.id}${command.name}`);
        setTimeout(() => {
          Timeout.delete(`${message.author.id}${command.name}`)
        }, time);
      }
    }
  }
}
