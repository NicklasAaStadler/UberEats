const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imgDir = path.join(__dirname, 'img');

function getImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getImages(full));
    else if (/\.(jpg|jpeg)$/i.test(entry.name)) results.push(full);
  }
  return results;
}

async function run() {
  const images = getImages(imgDir);
  console.log(`Compressing ${images.length} images...\n`);

  for (const img of images) {
    const before = fs.statSync(img).size;
    const buf = await sharp(img)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toBuffer();

    if (buf.length < before) {
      const tmp = img + '.tmp';
      fs.writeFileSync(tmp, buf);
      fs.renameSync(tmp, img);
      console.log(`✓ ${path.basename(img).padEnd(24)} ${Math.round(before / 1024)}KB → ${Math.round(buf.length / 1024)}KB`);
    } else {
      console.log(`- ${path.basename(img).padEnd(24)} already small, skipped`);
    }
  }

  console.log('\nDone.');
}

run().catch(console.error);
