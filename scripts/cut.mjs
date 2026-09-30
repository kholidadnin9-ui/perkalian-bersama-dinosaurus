import sharp from 'sharp';

const files = ['dino-green', 'dino-red', 'dino-blue', 'dino-purple'];

for (const name of files) {
  const img = sharp(`src/assets/${name}.png`).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const px = new Uint8Array(data.buffer, data.byteOffset, data.length);

  const isBg = (i) => {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mx > 218 && mx - mn < 26;
  };

  const visited = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    const p = y * w + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isBg(p * c)) stack.push(p);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    px[p * c + 3] = 0;
    const x = p % w, y = (p / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (px[p * c + 3] === 0) continue;
      let open = 0;
      for (const q of [p - 1, p + 1, p - w, p + w]) if (px[q * c + 3] === 0) open++;
      if (open > 0) {
        px[p * c] = Math.max(0, px[p * c] - 12);
        px[p * c + 1] = Math.max(0, px[p * c + 1] - 12);
        px[p * c + 2] = Math.max(0, px[p * c + 2] - 12);
        if (open >= 3) px[p * c + 3] = 120;
      }
    }
  }

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * c + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) { console.error('nothing kept', name); continue; }
  const pad = 8;
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);

  await sharp(Buffer.from(px), { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .resize({ height: 620, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 88, colors: 160 })
    .toFile(`src/assets/${name}-s.png`);
  console.log(name, '->', maxX - minX + 1, 'x', maxY - minY + 1);
}
