const { writeFile } = require('fs/promises');
const { tmpdir } = require('os');
const path = require('path');
const { sticker } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'sticker',
  description: 'Convert image to sticker / Tukar imej kepada pelekat',
  async execute({ msg, sock }) {
    const quoted = msg.quoted || msg;
    const mime = quoted?.mimetype || '';

    if (!mime.startsWith('image')) {
      return msg.reply('🖼️ *Reply to an image!* / *Sila reply pada gambar!*');
    }

    try {
      const media = await sock.downloadMediaMessage(quoted);
      const filePath = path.join(tmpdir(), `sticker-${Date.now()}.jpg`);
      await writeFile(filePath, media);

      const stickerBuf = await sticker(filePath, {
        pack: 'EllyBot 🫦',
        author: 'HiddenByCherryiz',
        type: 'full',
        quality: 70,
      });

      await sock.sendMessage(msg.from, { sticker: stickerBuf }, { quoted: msg });
    } catch (err) {
      console.error(err);
      msg.reply('⚠️ *Failed to create sticker.* / *Gagal buat sticker.*');
