module.exports = client => {
  const config = require(`../../config.json`);
  client.user.setPresence({
    status: `online`,
    //activity: {
    //  name: config.settings.status,
    //  type: `WATCHING`,
    //}
  });
  console.log(`---------------------------------`);
  console.log(`   Status`);
  console.log(`---------------------------------`);
  console.log(`Status | ${client.user.username} Loaded`);
};
