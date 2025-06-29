module.exports = {
  name: 'menu',
  description: 'Show bot command list / Papar senarai command bot',
  async execute({ msg, config, isOwner, isPremium }) {
    const toSmallCaps = (text) => {
      const normal = 'abcdefghijklmnopqrstuvwxyz';
      const smallcaps = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ';
      return text
        .split('')
        .map((char) => {
          const idx = normal.indexOf(char.toLowerCase());
          return idx > -1 ? smallcaps[idx] : char;
        })
        .join('');
    };

    const menuText = `╭─❍  *${toSmallCaps(config.botname)} ᴍᴇɴᴜ* ❍─╮

👑  ${toSmallCaps('Admin Only')} / Admin Sahaja:
   • .addpremium [nombor] — Tambah user premium
   • .delpremium [nombor] — Buang user premium
   • .self / .public — Tukar mode bot

💎  ${toSmallCaps('Premium Features')} / Ciri Premium:
   • .aiimage [text] — Generate AI image
   • .hd (reply gambar) — HD enhancer
   • .brat (reply gambar) — Brat-style sticker

📦  ${toSmallCaps('General Commands')} / Umum:
   • .menu — Buka menu
   • .tagall — Mention semua ahli
   • .hidetag [text] — Sebut tanpa nama
   • .sticker (reply gambar) — Jadikan sticker
   • .runtime — Masa aktif bot
   • .ping — Uji respon bot

📌  ${toSmallCaps('Status')}:
   • Mode: ${config.selfMode ? '🔒 Self' : '🌐 Public'}
   • You: ${isOwner ? '👑 Owner' : isPremium ? '💎 Premium' : '🧍 User'}

🕒 ${new Date().toLocaleTimeString()} | 📅 ${new Date().toLocaleDateString()}
╰─────────────⸙`;

    msg.reply(menuText);
  }
};
