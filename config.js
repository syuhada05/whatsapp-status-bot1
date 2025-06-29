module.exports = {
  botname: 'ᴇʟʟʏʙᴏᴛ 🫦', // Nama bot kau
  owner: ['601139137441'], // Gantikan dengan nombor kau tanpa '+'
  mess: {
    owner: '❌ Hanya *owner* boleh guna command ni!',
    group: '❌ Command ini hanya boleh digunakan dalam group!',
    premium: '⚠️ Ciri ini hanya untuk user *premium*!'
  },
  listprefix: ['.'], // Prefix command, boleh letak banyak contoh: ['.', '!', '#']
  selfMode: false, // true = hanya owner boleh guna; false = semua boleh guna
  feature: {
    aiimage: true,   // Enable/disable ciri AI image
    brat: true,      // Enable brat-style sticker
    sticker: true,   // Enable sticker dari image
    hd: true         // Enable HD Remini image (kalau ada API atau simpanan)
  }
};
