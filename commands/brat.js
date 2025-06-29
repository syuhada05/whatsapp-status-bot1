const { MessageMedia } = require('whatsapp-web.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'brat',
  description: 'Buat sticker gaya brat (background putih, teks hitam tebal)',
  premium: true,

  execute: async ({ msg, args }) => {
    if (!args.length) return msg.reply('👀 Contoh: .brat I’m not rude, you’re just irrelevant');

    const text = args.join(' ');
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text style
    ctx.fillStyle = 'black';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Auto-wrap text
    const lines = [];
    let line = '';
    const words = text.split(' ');

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 480 && i > 0) {
        lines.push(line.trim());
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const lineHeight = 50;
    const startY = canvas.height / 2 - (lines.length / 2) * lineHeight;
    lines.forEach((l, i) => {
      ctx.fillText(l, canvas.width / 2, startY + i * lineHeight);
    });

    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(__dirname, '..', 'temp', `brat_${Date.now()}.png`);
    fs.writeFileSync(filePath, buffer);

    const media = MessageMedia.fromFilePath(filePath);
    await msg.reply(media, undefined, { sendMediaAsSticker: true });

    fs.unlinkSync(filePath); // remove temp file
  }
};
