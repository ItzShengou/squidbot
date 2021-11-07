const { readdirSync } = require(`fs`);
module.exports = (client) => {
  console.log(`---------------------------------`);
  console.log(`   Events`);
  console.log(`---------------------------------`);
  const load = dirs => {
    const events = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith(`js`));
    for (let file of events) {
      let evt = require(`../events/${dirs}/${file}`);
      let eName = file.split('.')[0];
      client.on(eName, evt.bind(null, client));
      console.log(`Loading | ${eName}`);
    }
  };
  [`client`, `guild`].forEach((x) => load(x));
};
