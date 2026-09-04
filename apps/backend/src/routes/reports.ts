import { db } from '@repo/database';
import { pub, staffOnly } from '../orpc';
import { privateEnv } from '@repo/env';
import { invalidateReportsCache } from './geojson';
import { mkdir, exists, writeFile, rename } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Ensure the image directory exists
const imageDirectoryPath = `${privateEnv().storageDirectory}/images`;

// ensure directory exists
if (!(await exists(imageDirectoryPath))) {
  await mkdir(imageDirectoryPath, { recursive: true });
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// Magic bytes for image validation
const IMAGE_MAGIC_BYTES = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
  'image/gif': [0x47, 0x49, 0x46, 0x38], // GIF8
};

/**
 * Validates if the uploaded file is a valid image
 */
async function validateImageFile(blob: Blob): Promise<void> {
  // Check file size
  if (blob.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(blob.type)) {
    throw new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`);
  }

  // Validate magic bytes to ensure it's actually an image
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const isValidImage = Object.values(IMAGE_MAGIC_BYTES).some((magicBytes) => {
    if (uint8Array.length < magicBytes.length) return false;
    return magicBytes.every((byte, index) => uint8Array[index] === byte);
  });

  if (!isValidImage) {
    throw new Error('File does not appear to be a valid image');
  }
}

/**
 * Atomically writes a file to prevent race conditions
 */
async function atomicWriteFile(filePath: string, data: ArrayBuffer): Promise<void> {
  const tempPath = `${filePath}.tmp.${randomUUID()}`;

  try {
    // Write to temporary file first using Bun's file API
    const tempFile = Bun.file(tempPath);
    await tempFile.write(data);

    // Atomically move to final location
    await rename(tempPath, filePath);
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await Bun.file(tempPath).unlink();
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

export const postReport = pub.reports.postReport.handler(async ({ input, context }) => {
  const result = await db.addReport(input);
  invalidateReportsCache();
  return result;
});

export const patchReportStatus = staffOnly.reports.patchReportStatus.handler(async ({ input }) => {
  await db.updateReportStatus(input.id, input.status);
  invalidateReportsCache();
});

export const postImage = pub.reports.postImage.handler(async ({ input, context }) => {
  // TODO: figure out how oRPC error handling works
  // Since the images use bring your own uuid, we only allow images to be uploaded if a report with the image uuid has already been created.
  // This prevents images not associated with any report from being uploaded.
  const isReferenced = await db.isImageReferenced(input.imageUuid);
  if (!isReferenced) {
    throw new Error('Image not referenced by any report');
  }

  // Validate the uploaded image file
  await validateImageFile(input.image);

  // Check if image uuid exists in the image directory, if it does then 409 Conflict
  const imageFile = Bun.file(`${imageDirectoryPath}/${input.imageUuid}`);
  if (await imageFile.exists()) {
    throw new Error('Image already uploaded');
  }

  // Save the image to the image directory using atomic write
  const arrayBuffer = await input.image.arrayBuffer();
  await atomicWriteFile(`${imageDirectoryPath}/${input.imageUuid}`, arrayBuffer);
});

export const getImage = pub.reports.getImage.handler(async ({ input, context }) => {
  const imageFile = Bun.file(`${imageDirectoryPath}/${input.imageUuid}`);
  if (!(await imageFile.exists())) {
    throw new Error('Image not found');
  }
  return imageFile;
});

export const reportsRouter = {
  postReport: postReport,
  postImage: postImage,
  getImage: getImage,
  patchReportStatus: patchReportStatus,
};

/*

(parameter) input: {
    creatorDeviceId: string;
    category: "other" | "fallenTree" | "drainage" | "erosion" | "structureFailure" | "damagedSign" | "seasonal";
    route: number;
    trail: number;
    geometry: {
        coordinates: [number, number, number];
        type: "Point";
    };
    id?: number | undefined;
    localId?: string | null | undefined;
    creatorUserId?: string | null | undefined;
    image?: string | null | undefined;
    blurHash?: string | null | undefined;
    status?: "open" | "confirmed" | "inProgress" | "closed" | undefined;
    reportedAt?: Date | undefined;
    updatedAt?: Date | undefined;
}

*/
