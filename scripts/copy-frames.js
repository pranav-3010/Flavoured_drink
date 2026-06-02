const fs = require('fs');
const path = require('path');

if (process.env.VERCEL) {
  console.log("Vercel deployment detected. Skipping copy-frames script as frames are already checked into Git.");
  process.exit(0);
}

const srcFolders = {
  mango: path.resolve(__dirname, '../../Mango_frames-jpg'),
  chocolate: path.resolve(__dirname, '../../Choclate_Almond_frames-jpg'),
  pomegranate: path.resolve(__dirname, '../../Pomegranete_juice_frames-jpg')
};

// Static images map from parent folder to flavor destinations
const staticAssets = [
  {
    src: path.resolve(__dirname, '../../Raw mango juice spalsh.png'),
    dest: path.resolve(__dirname, '../public/images/mango/splash.png')
  },
  {
    src: path.resolve(__dirname, '../../Mango background.png'),
    dest: path.resolve(__dirname, '../public/images/mango/bg.png')
  },
  {
    src: path.resolve(__dirname, '../../chcolate splash.png'),
    dest: path.resolve(__dirname, '../public/images/chocolate/splash.png')
  },
  {
    src: path.resolve(__dirname, '../../Choclate background.png'),
    dest: path.resolve(__dirname, '../public/images/chocolate/bg.png')
  },
  {
    src: path.resolve(__dirname, '../../Pomogranete splash.png'),
    dest: path.resolve(__dirname, '../public/images/pomegranate/splash.png')
  },
  {
    src: path.resolve(__dirname, '../../pomogranete background.png'),
    dest: path.resolve(__dirname, '../public/images/pomegranate/bg.png')
  }
];

const destBase = path.resolve(__dirname, '../public/images');

function copyFolder(flavor, srcDir) {
  const destDir = path.join(destBase, flavor);
  
  if (!fs.existsSync(srcDir)) {
    console.warn(`[WARNING] Source directory does not exist: ${srcDir}`);
    return;
  }
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  console.log(`Copying frames for [${flavor}]...`);
  const files = fs.readdirSync(srcDir);
  let count = 0;
  
  files.forEach(file => {
    if (file.startsWith('ezgif-frame-') && file.endsWith('.jpg')) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      fs.copyFileSync(srcFile, destFile);
      count++;
    }
  });
  
  console.log(`Successfully copied ${count} frame files for [${flavor}]!`);
}

// Ensure public/images exists
if (!fs.existsSync(destBase)) {
  fs.mkdirSync(destBase, { recursive: true });
}

// Copy each flavor's folder
Object.entries(srcFolders).forEach(([flavor, srcDir]) => {
  copyFolder(flavor, srcDir);
});

// Copy static assets
console.log("Copying static splash and background assets...");
staticAssets.forEach(asset => {
  if (fs.existsSync(asset.src)) {
    const destDir = path.dirname(asset.dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(asset.src, asset.dest);
    console.log(`Copied: ${path.basename(asset.src)} -> ${asset.dest}`);
  } else {
    console.warn(`[WARNING] Asset not found: ${asset.src}`);
  }
});

console.log("Assets preparation finished!");
