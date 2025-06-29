const fs = require('fs-extra');

module.exports = {
  name: 'addpremium',
  description: 'Tambah nombor ke senarai premium (owner only)',
  owner: true,
  async execute({ msg, args }) {
    const premiumFile = './data/premium.json';
    let premiumUsers = fs.existsSync(premiumFile) ? JSON.parse(fs.readFileSync(premiumFile)) : [];

    if (!args[0]) return msg.reply('❌ Sila masukkan nombor. Contoh: `.addpremium 601139137441`');

    const number = args[0].replace(/\D/g, ''); // Buang bukan nombor
    if (premiumUsers.includes(number)) return msg.reply('⚠️ Nombor ini sudah ada dalam senarai premium.');

    premiumUsers.push(number);
    fs.writeFileSync(premiumFile, JSON.stringify(premiumUsers, null, 2));

    msg.reply(`✅ Nombor *${number}* berjaya ditambah ke premium.`);
  }
};
