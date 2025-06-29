module.exports = {
  name: 'ping',
  description: 'Check bot response time / Semak kelajuan bot',
  async execute({ msg, sock }) {
    const start = Date.now();
    const sentMsg = await msg.reply('🏓 Pinging...');
    const end = Date.now();
    const ping = end - start;

    await sock.sendMessage(msg.from, {
      text: `🏓 *Pong!*\n⏱️ *Speed:* ${ping} ms\n📶 *Bot is active & responsive!*`,
    }, { quoted: sentMsg });
  }
};
