const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'brat',
  description: 'Generate brat style sticker dengan teks 🫦',
  async execute({ msg, args }) {
    if (!args.length) {
      return msg.reply('😗 Contoh: *.brat ɪ ʟᴏᴠᴇ ᴍᴇ 🫦*');
    }

    const text = args.join(' ');
    const stickerPath = path.join(__dirname, '../assets/brat_blank.png'); // gambar putih 512x512

    if (!fs.existsSync(stickerPath)) {
      return msg.reply('❌ Gambar latar brat_blank.png tiada dalam folder /assets');
    }

    const media = MessageMedia.fromFilePath(stickerPath);
    await msg.reply(media, undefined, {
      sendMediaAsSticker: true,
      stickerAuthor: text, // guna text sebagai nama sticker
      stickerName: 'ᴇʟʟʏʙᴏᴛ 🫦',
    });
  },
};
