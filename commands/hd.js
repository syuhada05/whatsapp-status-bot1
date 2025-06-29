const axios = require('axios');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

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

      // Simpan imej sementara
      const tempPath = path.join(__dirname, '../temp/original.png');
      await fs.ensureDir(path.dirname(tempPath));
      fs.writeFileSync(tempPath, Buffer.from(media.data, 'base64'));

      // Upload ke anonymous image hosting (imgbb atau temporari)
      const formData = new FormData();
      formData.append('image', fs.createReadStream(tempPath));

      // Guna Replicate API - Real-ESRGAN
      const response = await axios.post(
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
            'Authorization': `Token ${process.env.OPENAI_API_KEY=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}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const getUrl = async () => {
        let result = null;
        while (!result) {
          const check = await axios.get(`https://api.replicate.com/v1/predictions/${response.data.id}`, {
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_KEY}`
            }
          });
          if (check.data.status === 'succeeded') result = check.data.output;
          else await new Promise(r => setTimeout(r, 2000));
        }
        return result;
      };

      const outputUrl = await getUrl();

      // Download image result
      const res = await fetch(outputUrl);
      const buffer = await res.buffer();
      const enhancedPath = path.join(__dirname, '../temp/enhanced.png');
      fs.writeFileSync(enhancedPath, buffer);

      // Send result to user
      const resultMedia = await MessageMedia.fromFilePath(enhancedPath);
      await msg.reply(resultMedia);

      // Cleanup
      fs.unlinkSync(tempPath);
      fs.unlinkSync(enhancedPath);
    } catch (err) {
      console.error('❌ HD command error:', err);
      msg.reply('⚠️ Gagal enhance gambar.');
    }
  },
};
