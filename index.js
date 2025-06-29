// 🌟 LIBRARY & MODULE
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const moment = require('moment');
const config = require('./config');
require('dotenv').config();

// 🌟 PREMIUM USER
const premiumFile = './data/premium.json';
let premiumUsers = fs.existsSync(premiumFile) ? JSON.parse(fs.readFileSync(premiumFile)) : [];

// 🌟 INIT WHATSAPP CLIENT
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'ellybot-session',
    dataPath: './.wwebjs_auth',
    usePairingCode: true,
  }),
  puppeteer: {
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

// 🌟 PAIRING CODE
client.on('pairing-code', (code) => {
  console.log(`\n📲 Pairing Code untuk nombor: +${config.owner[0]}`);
  console.log(`📲 Pairing Code anda: ${code}`);
  console.log(`➡ Masukkan di WhatsApp App: Settings → Linked Devices → Pair with code`);
});

// 🌟 BOT READY
client.on('ready', () => {
  console.log(`\n🤖 Bot ${config.botname} telah aktif sepenuhnya!`);
  await viewAllStatuses(); // Auto view sekali bila bot ready
});

// 🌟 AUTO VIEW STATUS
const viewAllStatuses = async () => {
  const chats = await client.pupPage.evaluate(async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const selectors = {
      storyTray: '._2AOIt',
      storyItem: '._1-FMR'
    };

    const tray = document.querySelector(selectors.storyTray);
    if (!tray) return 'Tiada story tray.';

    tray.click();
    await sleep(1000);

    const items = document.querySelectorAll(selectors.storyItem);
    for (let i = 0; i < items.length; i++) {
      items[i].click();
      await sleep(3500); // boleh ubah ke 1500 kalau mahu lebih laju
    }

    document.querySelector('[data-icon="x-viewer"]')?.click();
    return `Telah lihat ${items.length} status.`;
  });

  console.log('👀 Auto view status:', chats);
};

// Ulang setiap 3 minit
setInterval(viewAllStatuses, 180000);

// 🌟 ANTI DELETE
client.on('message_revoke_everyone', async (after, before) => {
  if (before && before.body) {
    const chat = await before.getChat();
    chat.sendMessage(`❗ Mesej dipadam: ${before.body}`);
  }
});

// 🌟 VIEW ONCE SAVER (auto hantar ke owner)
client.on('message', async (msg) => {
  if (msg.hasMedia && msg.isViewOnce) {
    try {
      const media = await msg.downloadMedia();
      const senderName = msg._data.notifyName || msg._data.pushName || 'Unknown';
      const mediaType = media.mimetype.includes('image') ? 'Imej' :
                        media.mimetype.includes('video') ? 'Video' :
                        media.mimetype.includes('audio') ? 'Audio' : 'Media';
      const owner = config.owner[0] + '@c.us';
      await client.sendMessage(owner, `💾 *RVO dari ${senderName}*\nJenis: ${mediaType}`);
      await client.sendMessage(owner, new MessageMedia(media.mimetype, media.data, media.filename || 'view-once'));
    } catch (err) {
      console.error('❌ Gagal simpan View Once:', err);
    }
  }
});

// 🌟 LOAD SEMUA COMMAND DALAM FOLDER
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Map();
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
}

// 🌟 COMMAND HANDLER
client.on('message_create', async (msg) => {
  if (!msg.body || !config.listprefix.some(p => msg.body.startsWith(p))) return;

  const prefix = config.listprefix.find(p => msg.body.startsWith(p));
  const [fullCmd, ...args] = msg.body.slice(prefix.length).trim().split(/\s+/);
  const command = fullCmd.toLowerCase();
  const from = msg.from;
  const sender = msg.author || from;
  const isOwner = config.owner.includes(sender.replace('@c.us', ''));
  const isGroup = from.endsWith('@g.us');
  const isPremium = premiumUsers.includes(sender.replace('@c.us', ''));

  // Self Mode
  if (config.selfMode && !isOwner) return;

  const cmd = commands.get(command);
  if (!cmd) return;

  // Check permission
  if (cmd.owner && !isOwner) return msg.reply(config.mess.owner);
  if (cmd.group && !isGroup) return msg.reply(config.mess.group);
  if (cmd.premium && !isPremium) return msg.reply(config.mess.premium);

  // Execute command
  try {
    await cmd.execute({ client, msg, args, config, sender, isOwner, isGroup, isPremium });
  } catch (e) {
    console.error(`❌ Error command ${command}:`, e);
    msg.reply('⚠️ Terdapat ralat semasa menjalankan command ini.');
  }
});

// 🌟 MULAKAN BOT
client.initialize();
