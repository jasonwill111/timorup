// SHA256 hash utility for deduplication
// Uses Web Crypto API (native, no dependencies)

/**
 * Calculate SHA256 hash of a File or Blob
 * @param file - The file/blob to hash
 * @returns 64-character hex string
 */
export async function sha256(file: File | Blob): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate SHA256 hash from an ArrayBuffer
 * @param buffer - The buffer to hash
 * @returns 64-character hex string
 */
export async function sha256FromBuffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
