const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const imagePaths = [
    "c:\\Users\\Enzog\\OneDrive\\Escritorio\\Agente\\Idea de negocio 1\\Referencias app\\WhatsApp Image 2026-02-11 at 10.11.41 PM.jpeg",
    "c:\\Users\\Enzog\\OneDrive\\Escritorio\\Agente\\Idea de negocio 1\\Referencias app\\WhatsApp Image 2026-02-11 at 10.11.41 PM11.jpeg"
];

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

async function getDominantColors(imagePath) {
    try {
        console.log("Reading " + imagePath);
        const image = await Jimp.read(imagePath);

        const colorMap = {};
        const data = image.bitmap.data; // Buffer
        // iterate every 10 pixels to be fast. Each pixel is 4 bytes (RGBA)
        const step = 4 * 10;

        for (let i = 0; i < data.length; i += step) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // alpha is data[i+3], ignore for now or check if it's 0

            // Simple quantization to reduce similar colors (rounding to nearest 20)
            const rQ = Math.round(r / 20) * 20;
            const gQ = Math.round(g / 20) * 20;
            const bQ = Math.round(b / 20) * 20;

            const key = `${rQ},${gQ},${bQ}`;

            if (!colorMap[key]) {
                colorMap[key] = { count: 0, r: rQ, g: gQ, b: bQ };
            }
            colorMap[key].count++;
        }

        const sortedColors = Object.values(colorMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map(c => rgbToHex(c.r, c.g, c.b));

        return sortedColors;
    } catch (err) {
        console.error("Error processing " + imagePath, err);
        return [];
    }
}

(async () => {
    console.log("Extracting colors...");
    for (const imagePath of imagePaths) {
        if (fs.existsSync(imagePath)) {
            console.log(`\nColors for: ${path.basename(imagePath)}`);
            const colors = await getDominantColors(imagePath);
            console.log(colors.join(', '));
        } else {
            console.log(`\nFile not found: ${imagePath}`);
        }
    }
})();
