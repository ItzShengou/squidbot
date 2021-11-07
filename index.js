const { Client, Collection, MessageEmbed } = require(`discord.js`);
const { createConnection } = require(`mysql`);
const fs = require(`fs`);
const client = new Client({
  disableEveryone: true,
});
const config = require(`./config.json`);
const token = config.settings.token;

//Register Token
client.login(token);

//Commands
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync(`./commands/`);

//Events
[`command`, `event`].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

//Discord Integration
client.on(`guildMemberAdd`, async (member) => {

  var con = createConnection(config.mysql);
  con.connect(err => {
    if (err) return console.log(err);
  });

  con.query(`CREATE TABLE discord_integration (Name VARCHAR(50), SteamID BIGINT(20), Discord TEXT, Code TEXT)`, (err, row) => {
    if (!err) console.log(`The table has been created`);
  });

  var code = (Math.random() + 1).toString(36).substring(2);
  con.query(`SELECT * FROM discord_integration WHERE Discord = ${member.id}`, (err, row) => {
    if (row[0] !== undefined) return;
    con.query(`INSERT INTO discord_integration (Name, SteamID, Discord, Code) VALUES ('', '', '${member.id}', '${code}')`, (err, row) => {
      if (err) return console.log(`Recording error`);
      member.send(`Выш код: ${code}`);
    });
  });
});

//Errors
client.on(`error`, function (error) {
  let errors = new MessageEmbed()
    .setTitle(`Error`)
    .setColor(config.color.error)
    .setDescription(error)
    .setTimestamp()
  client.channels.cache.get(config.logs.error).send(errors);
});
client.on(`warn`, function (info) {
  let errors = new MessageEmbed()
    .setTitle(`Warn`)
    .setColor(config.color.error)
    .setDescription(info)
    .setTimestamp()
  client.channels.cache.get(config.logs.error).send(errors);
});
client.on('shardError', (error) => {
  let errors = new MessageEmbed()
    .setTitle(`WebSocket и Network`)
    .setColor(config.color.error)
    .setDescription(error)
    .setTimestamp()
  client.channels.cache.get(config.logs.error).send(errors);
});
process.on('unhandledRejection', (error) => {
  let errors = new MessageEmbed()
    .setTitle(`API`)
    .setColor(config.color.error)
    .setDescription(error)
    .setTimestamp()
  client.channels.cache.get(config.logs.error).send(errors);
});