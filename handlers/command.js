const { readdirSync } = require(`fs`);
module.exports = (client) => {
  console.log(`---------------------------------`);
  console.log(`   Commands`);
  readdirSync(`./commands/`).map(dir => {
    console.log(`---------------------------------`);
    console.log(`Modules | ${dir}`);
    console.log(`---------------------------------`);
    const commands = readdirSync(`./commands/${dir}/`).map(cmd => {
      let pull = require(`../commands/${dir}/${cmd}`);
      console.log(`Loading | ${pull.name}`);
      client.commands.set(pull.name, pull);
      if (pull.aliases) {
        pull.aliases.map(p => client.aliases.set(p,pull));
      }
    })
  })
}
