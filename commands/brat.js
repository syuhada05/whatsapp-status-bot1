const { createCanvas, loadImage } = require('canvas');
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
  name: 'brat',
  async execute({ client, msg }) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // Latar belakang putih
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 512, 512);

    // Guna emoji PNG iOS style
    const em1 = await loadImage('./assets/emoji_1.png'); // 🥺
    const em2 = await loadImage('./assets/emoji_2.png'); // 👉
    const em3 = await loadImage('./assets/emoji_3.png'); // 👈

    ctx.drawImage(em1, 120, 140, 64, 64);
    ctx.drawImage(em2, 200, 140, 64, 64);
    ctx.drawImage(em3, 280, 140, 64, 64);

    // Text brat style
    ctx.fillStyle = '#000';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('i want cuddles 😩', 256, 300);

    const buffer = canvas.toBuffer('image/png');
    const media = new MessageMedia('image/png', buffer.toString('base64'));
    await client.sendMessage(msg.from, media, { sendMediaAsSticker: true });
  }
};
