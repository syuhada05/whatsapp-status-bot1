const fs = require('fs');
const premiumFile = './data/premium.json';

module.exports = {
  name: 'delpremium',
  description: 'Buang nombor user dari senarai premium',
  owner: true,

  execute: async ({ msg, args }) => {
    if (args.length < 1) return msg.reply('❌ Contoh: .delpremium 601139137441');

    const target = args[0].replace(/[^0-9]/g, '');
    if (!target) return msg.reply('❌ Nombor tidak sah.');

    let premiumUsers = fs.existsSync(premiumFile) ? JSON.parse(fs.readFileSync(premiumFile)) : [];

    if (!premiumUsers.includes(target)) {
      return msg.reply('⚠️ Nombor ini tiada dalam senarai premium.');
    }

    premiumUsers = premiumUsers.filter(num => num !== target);
    fs.writeFileSync(premiumFile, JSON.stringify(premiumUsers, null, 2));
    msg.reply(`✅ Nombor ${target} telah dibuang dari senarai premium.`);
  }
};
