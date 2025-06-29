const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config(); // Pastikan di index.js juga ada ini!

module.exports = {
  name: 'hd',
  description: 'Enhance image using Replicate AI',
  premium: true,
  execute: async ({ msg }) => {
    if (!msg.hasMedia) return msg.reply('📸 Hantar gambar dulu untuk enhance.');

    try {
      const media = await msg.downloadMedia();
      if (!media || !media.mimetype.startsWith('image')) {
        return msg.reply('❗ Fail bukan jenis imej.');
      }

      // Simpan sementara
      const tempPath = path.join(__dirname, '../temp/original.png');
      await fs.ensureDir(path.dirname(tempPath));
      fs.writeFileSync(tempPath, Buffer.from(media.data, 'base64'));

      // Hantar permintaan ke Replicate
      const replicateRes = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: '928f60b6c552e58a0991d5f7e6b59ce47c8c5c3d24bc68240d5c8c515c72ddee',
          input: {
            image: `data:${media.mimetype};base64,${media.data}`,
            scale: 2,
            face_enhance: false
          }
        },
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_KEY=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}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const predictionId = replicateRes.data.id;

      // Polling status setiap 2 saat
      let outputUrl = null;
      while (!outputUrl) {
        const statusCheck = await axios.get(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_KEY=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}`
            }
          }
        );

        if (statusCheck.data.status === 'succeeded') {
          outputUrl = statusCheck.data.output;
        } else if (statusCheck.data.status === 'failed') {
          return msg.reply('❌ Gagal enhance gambar.');
        }

        if (!outputUrl) await new Promise(res => setTimeout(res, 2000));
      }

      // Muat turun imej hasil
      const response = await fetch(outputUrl);
      const buffer = await response.buffer();
      const enhancedPath = path.join(__dirname, '../temp/enhanced.png');
      fs.writeFileSync(enhancedPath, buffer);

      // Hantar balik
      const resultMedia = await MessageMedia.fromFilePath(enhancedPath);
      await msg.reply(resultMedia);

      // Cleanup
      fs.unlinkSync(tempPath);
      fs.unlinkSync(enhancedPath);
    } catch (err) {
      console.error('❌ HD command error:', err);
      msg.reply('⚠️ Terdapat ralat semasa enhance gambar.');
    }
  },
};
