const { createCanvas, registerFont } = require('canvas');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs-extra');
const path = require('path');

// (Optional) Guna font custom kalau ada, atau pakai default
// registerFont(path.join(__dirname, '../fonts/YourFont.ttf'), { family: 'BratFont' });

module.exports = {
  name: 'brat',
  description: 'Generate brat style sticker dengan teks 🫦',
  execute: async ({ msg, args }) => {
    try {
      if (!args.length) return msg.reply('😗 Hantar teks sekali contoh: *.brat ɪ ʟᴏᴠᴇ ᴍᴇ 🫦*');

      const text = args.join(' ');
      const width = 512;
      const height = 512;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Background putih
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);

      // Teks gaya brat
      ctx.fillStyle = '#000';
      ctx.font = 'bold 48px Arial'; // Tukar font kalau perlu
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);

      const buffer = canvas.toBuffer('image/png');
      const tempPath = path.join(__dirname, '../temp/brat_text.png');
      await fs.ensureDir(path.dirname(tempPath));
      fs.writeFileSync(tempPath, buffer);

      const media = await MessageMedia.fromFilePath(tempPath);
      await msg.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerAuthor: 'ᴇʟʟʏʙᴏᴛ',
        stickerName: 'ᴇʟʟʏʙᴏᴛ',
      });

      fs.unlinkSync(tempPath);
    } catch (err) {
      console.error('❌ Gagal hasilkan brat sticker:', err);
      msg.reply('⚠️ Gagal hasilkan brat style text.');
    }
  },
};
