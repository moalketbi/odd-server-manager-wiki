// upload.ts — convert a File to base64 and PUT it to the screenshots folder.

import { putFile, listDirectory } from './github';

export const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadResult {
  ok: boolean;
  message: string;
  newSha?: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is "data:image/png;base64,XXXX..."
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadScreenshot(
  token: string,
  slotFilename: string,
  file: File,
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      message: `Unsupported type "${file.type}". Use PNG, JPG, WebP, or GIF.`,
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      message: `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max is 10 MB. Compress with TinyPNG first.`,
    };
  }

  const base64 = await fileToBase64(file);
  const path = `public/screenshots/${slotFilename}`;

  // Look up existing SHA if the file already exists (replacement case).
  let existingSha: string | undefined;
  try {
    const dir = await listDirectory(token, 'public/screenshots');
    existingSha = dir.find((f) => f.name === slotFilename)?.sha;
  } catch {
    // Directory may not exist yet — proceed without sha (fresh upload).
  }

  try {
    const result = await putFile(
      token,
      path,
      base64,
      `feat: upload ${slotFilename}`,
      existingSha,
    );
    return { ok: true, message: 'Committed — site rebuilds in ~2 min.', newSha: result.sha };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return { ok: false, message };
  }
}
