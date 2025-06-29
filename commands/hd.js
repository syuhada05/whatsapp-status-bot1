const fs = require('fs');
const axios = require('axios');
const fetch = require('node-fetch');
const path = require('path');

module.exports = {
  name: 'hd',
  description: 'Enhance image quality using AI',
  category: 'tools',
  async execute(client, message, args) {
    const quoted = message.quoted || message;
    const mime = (quoted.msg || quoted).mimetype || '';
    
    if (!mime.includes('image')) {
      return message.reply('📸 Sila reply kepada gambar yang ingin ditingkatkan kualitinya.');
    }

    const mediaPath = await client.downloadAndSaveMediaMessage(quoted, 'hdimg');
    const base64Image = fs.readFileSync(mediaPath).toString('base64');
    const mimeType = 'image/jpeg';

    const replicateApiKey = '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';

    try {
      const res = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: '928f60b6c552e58a0991d5f7e6b59ce47c8c5c3d24bc68240d5c8c515c72ddee',
          input: {
            image: `data:${mimeType};base64,${base64Image}`,
            scale: 2,
            face_enhance: false
          }
        },
        {
          headers: {
            'Authorization': `Token ${replicateApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const predictionId = res.data.id;
      message.reply('⏳ Memproses gambar HD...');

      let outputUrl = null;
      while (!outputUrl) {
        const statusRes = await axios.get(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              'Authorization': `Token ${replicateApiKey}`
            }
          }
        );

        if (statusRes.data.status === 'succeeded') {
          outputUrl = statusRes.data.output;
        } else if (statusRes.data.status === 'failed') {
          return message.reply('❌ Gagal meningkatkan kualiti gambar.');
        } else {
          await new Promise(res => setTimeout(res, 2000));
        }
      }

      const finalRes = await fetch(outputUrl);
      const buffer = await finalRes.buffer();
      fs.writeFileSync('enhanced-output.png', buffer);

      await client.sendMessage(message.from, {
        image: fs.readFileSync('enhanced-output.png'),
        caption: '✅ Siap! Ini gambar versi HD kamu.'
      }, { quoted: message });

      fs.unlinkSync(mediaPath);
      fs.unlinkSync('enhanced-output.png');
    } catch (err) {
      console.error('Error:', err?.response?.data || err.message);
      message.reply('⚠️ Gagal memproses gambar.');
    }
  }
};
