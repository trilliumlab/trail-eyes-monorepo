import { db } from '@repo/database';
import { pub } from '../orpc';
import { privateEnv } from '@repo/env';
import { mkdir, exists } from 'node:fs/promises';

// Ensure the image directory exists
const imageDirectoryPath = `${privateEnv().storageDirectory}/images`;

// ensure directory exists
if (!(await exists(imageDirectoryPath))) {
  await mkdir(imageDirectoryPath, { recursive: true });
}

const imageDirectory = Bun.file(imageDirectoryPath);

export const postReport = pub.reports.postReport.handler(async ({ input, context }) => {
  return await db.addReport(input);
});

export const postImage = pub.reports.postImage.handler(async ({ input, context }) => {
  const isReferenced = await db.isImageReferenced(input.imageUuid);
  if (!isReferenced) {
    throw new Error('Image not referenced by any report');
  }
  // Check if image uuid exists in the image directory, if it does then 409 Conflict
  const imageFile = Bun.file(`${imageDirectory}/${input.imageUuid}`);
  if (await imageFile.exists()) {
    throw new Error('Image already uploaded');
  }
  // Save the image to the image directory
  const arrayBuffer = await input.image.arrayBuffer();
  await imageFile.write(arrayBuffer);
});

export const reportsRouter = {
  postReport: postReport,
  postImage: postImage,
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
