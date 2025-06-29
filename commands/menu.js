module.exports = {
  name: 'menu',
  description: 'Papar senarai command bot',
  async execute({ msg, config }) {
    const menuText = `🧾 *${config.botname} Menu:*

👑 *Admin Only*
• .addpremium [nombor]
• .delpremium [nombor]
• .self / .public

💎 *Premium Only*
• .aiimage [teks]
• .hd (reply gambar)
• .brat (reply gambar)

📦 *Umum*
• .menu
• .tagall
• .hidetag [teks]
• .sticker (reply gambar)
• .runtime
• .ping

📌 *Status:*
• Self Mode: ${config.selfMode ? '✅ ON' : '❌ OFF'}
• Premium User: ${msg.from.split('@')[0]}
`;

    msg.reply(menuText);
  }
};
