const { MessageMedia } = require('whatsapp-web.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  name: 'brat',
  description: 'Sticker brat aesthetic 🫦',
  execute: async ({ msg }) => {
    try {
      const width = 512;
      const height = 512;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Load each emoji PNG
      const emojiPaths = [
        path.join(__dirname, '../assets/emoji/brat1.png'), // 🥺
        path.join(__dirname, '../assets/emoji/brat2.png'), // 👉
        path.join(__dirname, '../assets/emoji/brat3.png'), // 👈
      ];

      const emojiImages = await Promise.all(emojiPaths.map(p => loadImage(p)));

      // Draw emojis on canvas with spacing
      const spacing = 20;
      let currentX = (width - ((emojiImages.length * 100) + ((emojiImages.length - 1) * spacing))) / 2;

      for (const emoji of emojiImages) {
        ctx.drawImage(emoji, currentX, height / 2 - 50, 100, 100);
        currentX += 100 + spacing;
      }

      // Save temp image
      const tempPath = path.join(__dirname, '../temp/brat_sticker.png');
      await fs.ensureDir(path.dirname(tempPath));
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(tempPath, buffer);

      // Send as sticker
      const media = await MessageMedia.fromFilePath(tempPath);
      await msg.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerAuthor: 'EllyBot',
        stickerName: 'Brat Style',
      });

      // Cleanup
      fs.unlinkSync(tempPath);
    } catch (err) {
      console.error('❌ Gagal buat brat sticker:', err);
      msg.reply('⚠️ Gagal hasilkan brat sticker.');
    }
  },
};
