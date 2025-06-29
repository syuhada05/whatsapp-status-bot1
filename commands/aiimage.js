const fetch = require('node-fetch');
const { MessageMedia } = require('whatsapp-web.js');
const fs = require('fs-extra');

module.exports = {
  name: 'aiimage',
  description: 'Generate imej AI dari teks (premium only)',
  premium: true,
  async execute({ msg, args }) {
    const prompt = args.join(' ');
    if (!prompt) return msg.reply('❌ Masukkan teks untuk dijadikan gambar. Contoh:\n.aiimage cat wearing sunglasses in space');

    msg.reply('🧠 Sedang cipta imej AI... tunggu jap!');

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY=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}`
        },
        body: JSON.stringify({
          prompt,
          n: 1,
          size: '512x512'
        })
      });

      const data = await response.json();

      if (!data.data || !data.data[0]?.url) {
        return msg.reply('❌ Gagal cipta imej. Mungkin limit API dah habis atau prompt terlalu pelik.');
      }

      const imgUrl = data.data[0].url;
      const imgBuffer = await fetch(imgUrl).then(res => res.buffer());
      const media = new MessageMedia('image/jpeg', imgBuffer.toString('base64'), 'ai-image.jpg');

      await msg.reply(media, undefined, { caption: `🖼️ *Imej AI untuk:* ${prompt}` });

    } catch (err) {
      console.error(err);
      msg.reply('❌ Error berlaku semasa cipta imej.');
    }
  }
};
