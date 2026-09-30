import sharp from 'sharp';
const files = ['dino-green','dino-red','dino-blue','dino-purple'];
for (const n of files) {
  await sharp(`public/images/${n}-cut.png`)
    .resize({ height: 620, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 88, colors: 160 })
    .toFile(`public/images/${n}-s.png`);
}
console.log('ok');
