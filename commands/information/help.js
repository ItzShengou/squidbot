const { MessageEmbed } = require(`discord.js`);
const config = require(`../../config.json`);

module.exports = {
  name: `help`,
  aliases: [`хелп`],
  category: `public`,
  description: `Получить все команды или запросить помощь по команде`,
  usage: `[команда]`,
  run: async (client, message, args) => {
    if (args[0]) {
      return getCMD(client, message, args[0]);
    } else {
      return getAll(client, message);
    }
  },
};

async function getAll(client, message) {
  function list(cat) {
    return `${client.commands.filter(cmd => cmd.category == cat).map(cmd => `\`${config.settings.prefix}${cmd.name} ${cmd.usage}\`: ${cmd.description}`).join(`\n`)}`;
  }
  const embed = new MessageEmbed()
    .setAuthor(`Команды ${message.client.user.username}`, `http://resain.ru/bots/loading.gif`)
    .setColor(config.color.main)
    .setDescription(`${list(`public`)}`)
    .setFooter(`Вы можете написать ${config.settings.prefix}help [команда] и получить информацию`);
  return message.channel.send(embed);
}

async function getCMD(client, message, input) {
  const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
  const embed = new MessageEmbed()
    .setTitle(`Команда: ${cmd.name}`)
    .setColor(config.color.green)
    .setDescription(`Название: ${cmd.name} \nОписание: ${cmd.description} \nИспользование: \`${config.settings.prefix}${cmd.name} ${cmd.usage}\``)
  return message.channel.send(embed);
}
