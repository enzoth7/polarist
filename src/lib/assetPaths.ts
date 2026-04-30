const LEGACY_IMAGE_EXTENSION_PATTERN = /\.(png|jpe?g)$/i;
const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm)$/i;
const REMOTE_ASSET_PATTERN = /^(?:https?:)?\/\//i;

const isNonLocalAsset = (assetPath: string) =>
  REMOTE_ASSET_PATTERN.test(assetPath) ||
  assetPath.startsWith("data:") ||
  assetPath.startsWith("blob:");

export const toModernImageAsset = (assetPath?: string | null) => {
  if (!assetPath) {
    return assetPath ?? null;
  }

  if (isNonLocalAsset(assetPath)) {
    return assetPath;
  }

  return assetPath.replace(LEGACY_IMAGE_EXTENSION_PATTERN, ".webp");
};

export const toModernAssetFilename = (filename?: string | null) => {
  if (!filename) {
    return filename ?? null;
  }

  return filename.replace(LEGACY_IMAGE_EXTENSION_PATTERN, ".webp");
};

export const isVideoAsset = (assetPath: string) => VIDEO_EXTENSION_PATTERN.test(assetPath);
