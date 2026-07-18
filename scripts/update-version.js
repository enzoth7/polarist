import fs from 'fs';

try {
  const versionData = { version: Date.now().toString() };
  fs.writeFileSync('public/version.json', JSON.stringify(versionData, null, 2));
  console.log(`[Version Updater] Generated new version.json: ${versionData.version}`);
} catch (error) {
  console.error('[Version Updater] Failed to write version.json:', error);
  process.exit(1);
}
