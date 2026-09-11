// Resizes/re-encodes an image file in the browser before upload. Large photos
// straight off a phone camera (iPhone HEIC in particular can be 5-15MB) are the
// most likely cause of multipart uploads getting cut off mid-transfer — shrinking
// client-side sidesteps that regardless of exactly where the size limit lives.
export async function compressImage(file, { maxDimension = 1600, quality = 0.82 } = {}) {
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) return file; // conversion failed — fall back to the original

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch {
    // Some browsers can't decode HEIC via canvas — just upload the original rather
    // than block the user. The backend already accepts HEIC directly.
    return file;
  }
}
