/**
 * Shared validation and storage utilities for API routes.
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BASE64_SIZE = 5 * 1024 * 1024; // 5MB after decoding (~6.67MB base64 string)
const SIGNED_URL_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

/**
 * Validate base64 image payload.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImagePayload(imageBase64, mimeType) {
  if (!imageBase64 || !mimeType) {
    return { valid: false, error: 'Image data and MIME type are required' };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid image type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  // Estimate decoded size from base64 length (base64 is ~4/3 of original)
  const estimatedBytes = Math.ceil((imageBase64.length * 3) / 4);
  if (estimatedBytes > MAX_BASE64_SIZE) {
    return {
      valid: false,
      error: `Image too large. Maximum size: ${MAX_BASE64_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Extract the storage file path from an image_url value.
 * Supports:
 *   - storage://skin-images/userId/filename.ext (new format)
 *   - https://.../storage/v1/object/public/skin-images/... (legacy public URL)
 *   - https://.../storage/v1/object/sign/skin-images/... (legacy signed URL)
 * Returns null for data URIs or unrecognizable URLs.
 */
export function extractStoragePath(imageUrl) {
  if (!imageUrl || imageUrl.startsWith('data:')) return null;

  // New format: storage://skin-images/path
  if (imageUrl.startsWith('storage://skin-images/')) {
    return imageUrl.replace('storage://skin-images/', '');
  }

  // Legacy: /storage/v1/object/public|sign/skin-images/...
  const match = imageUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/skin-images\/(.+?)(?:\?.*)?$/);
  if (match) return match[1];

  // Simple match: .../skin-images/userId/filename.ext
  const simpleMatch = imageUrl.match(/skin-images\/(.+?)(?:\?.*)?$/);
  if (simpleMatch) return simpleMatch[1];

  return null;
}

/**
 * Delete a file from Supabase storage by its path within the skin-images bucket.
 */
export async function deleteStorageFile(supabase, filePath) {
  if (!filePath) return;
  try {
    await supabase.storage.from('skin-images').remove([filePath]);
  } catch (err) {
    console.error('[Storage] Failed to delete file:', filePath, err);
  }
}

/**
 * Generate a signed URL for a stored image.
 * Returns the original URL unchanged if it's a data URI or unrecognizable.
 */
export async function toSignedUrl(supabase, imageUrl) {
  if (!imageUrl || imageUrl.startsWith('data:')) return imageUrl;

  const filePath = extractStoragePath(imageUrl);
  if (!filePath) return imageUrl;

  const { data, error } = await supabase.storage
    .from('skin-images')
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

  if (error || !data?.signedUrl) {
    console.error('[Storage] Failed to create signed URL:', error);
    return imageUrl; // Fallback to original
  }

  return data.signedUrl;
}

/**
 * Convert image_url fields in an array of scan objects to signed URLs.
 */
export async function signScanUrls(supabase, scans) {
  if (!scans || scans.length === 0) return scans;
  return Promise.all(
    scans.map(async (scan) => ({
      ...scan,
      image_url: await toSignedUrl(supabase, scan.image_url),
    }))
  );
}
